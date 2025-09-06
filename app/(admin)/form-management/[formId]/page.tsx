"use client"

import { useParams } from "next/navigation"
import { useGetForm, type FormWithFields } from "./_hooks/formId-hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Loader2, 
  Copy, 
  ExternalLink, 
  Users, 
  Calendar, 
  ArrowLeft, 
  FileText, 
  BarChart3, 
  Download,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Clock,
  Filter,
  Plus,
  QrCode,
  Smartphone,
  Camera,
  Scan,
  Download as DownloadIcon,
  X,
  Edit,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import QRScanner from "@/components/qr-code/qr-scanner"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface FormSubmission {
  id: string;
  data: any;
  createdAt: string;
  formId: string;
}

interface ProcessedSubmission {
  id: string;
  fields: Array<{
    label: string;
    value: any;
    type: string;
  }>;
  submittedAt: string;
  email?: string;
  name?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  session: string;
  formId: string;
}

export default function FormDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [formId, setFormId] = useState<string>("")
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all')
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scannedData, setScannedData] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle params properly to avoid hydration issues
  useEffect(() => {
    if (params?.formId) {
      setFormId(params.formId as string)
    }
  }, [params])

  const { data: form, isPending, error } = useGetForm(formId)

  // Process form submissions data
  const processSubmissions = (): ProcessedSubmission[] => {
    if (!form || !form[0] || !form[0].datas) return []
    
    return form[0].datas.map((submission: FormSubmission) => {
      const fields = form[0].fields.map(field => {
        const value = submission.data[field.label] || submission.data[field.id] || ''
        return {
          label: field.label,
          value: value,
          type: field.type
        }
      })
      
      // Try to extract email and name from common field names
      const email = fields.find(f => 
        f.label.toLowerCase().includes('email') || 
        f.label.toLowerCase().includes('e-mail')
      )?.value
      
      const name = fields.find(f => 
        f.label.toLowerCase().includes('name') || 
        f.label.toLowerCase().includes('full name')
      )?.value
      
      return {
        id: submission.id,
        fields,
        submittedAt: submission.createdAt,
        email,
        name
      }
    })
  }

  const submissions = processSubmissions()

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    if (!formId) return
    setAttendanceLoading(true)
    try {
      const response = await fetch(`/api/attendance?formId=${formId}`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch attendance data')
      const data = await response.json()
      // Filter records for this specific form
      const formRecords = (data.attendanceRecords || []).filter((record: any) => record.formId === formId)
      setAttendanceData(formRecords)
    } catch (error) {
      console.error('Error fetching attendance data:', error)
      toast.error('Failed to load attendance data')
    } finally {
      setAttendanceLoading(false)
    }
  }

  // Fetch attendance data when form loads
  useEffect(() => {
    if (formId) {
      fetchAttendanceData()
    }
  }, [formId])

  // Process attendance data for display
  const processAttendanceData = (): AttendanceRecord[] => {
    if (!attendanceData.length) return []
    
    // Group by student and date
    const groupedData = attendanceData.reduce((acc: any, record: any) => {
      const key = `${record.studentId}-${record.date}`
      if (!acc[key]) {
        acc[key] = {
          id: record.id,
          studentId: record.studentId,
          studentName: record.studentName,
          date: record.date,
          status: record.status,
          session: record.session,
          formId: record.formId
        }
      }
      return acc
    }, {})

    return Object.values(groupedData) as AttendanceRecord[]
  }

  const attendanceRecords = processAttendanceData()

  // Filter attendance records
  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDate
    const matchesFilter = attendanceFilter === 'all' || record.status === attendanceFilter
    return matchesDate && matchesFilter
  })

  // Mark attendance
  const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          formId,
          studentId,
          date: selectedDate,
          status
        })
      })
      
      if (!response.ok) throw new Error('Failed to mark attendance')
      
      toast.success(`Marked as ${status}`)
      fetchAttendanceData() // Refresh data
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error('Failed to mark attendance')
    }
  }

  // Bulk actions
  const markAllPresent = () => {
    submissions.forEach(submission => {
      markAttendance(submission.id, 'present')
    })
  }

  const markAllAbsent = () => {
    submissions.forEach(submission => {
      markAttendance(submission.id, 'absent')
    })
  }

  // QR Code Scanner for attendance
  const openQRScanner = () => {
    setShowQRScanner(true)
    setIsScanning(true)
    setScannedData('')
  }

  const closeQRScanner = () => {
    setShowQRScanner(false)
    setIsScanning(false)
    setScannedData('')
  }

  // Generate QR code for a specific submission
  const generateSubmissionQR = (submission: any) => {
    const qrData = {
      userId: submission.id,
      formId: formId,
      timestamp: new Date().toISOString(),
      formData: submission.fields.reduce((acc: any, field: any) => {
        acc[field.id || `field_${Math.random().toString(36).substr(2, 9)}`] = field.value
        return acc
      }, {}),
      type: "attendance"
    }
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`
    return qrCodeUrl
  }

  // Download QR code as image
  const downloadQRCode = (qrCodeUrl: string, studentName: string) => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `qr_${studentName.replace(/\s+/g, '_')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`QR code for ${studentName} downloaded!`)
  }

  const handleQRScan = (result: string) => {
    // Keep scanning active, don't close modal
    setScannedData(result)
    
    console.log('🔍 Scanned QR Code Data:', result)
    console.log('📋 Available Submissions:', submissions)
    
    // Parse the scanned data to find student information
    try {
      // Try to parse as JSON first
      let studentData = result.trim()
      let parsedData = null
      
      try {
        parsedData = JSON.parse(result)
        console.log('📄 Parsed JSON data:', parsedData)
      } catch (e) {
        // Not JSON, treat as plain text
        console.log('📝 Plain text data:', studentData)
      }
      
      // Find the student in submissions with multiple matching strategies
      let student = null
      
      if (parsedData) {
        // Try matching with parsed JSON data
        student = submissions.find(sub => 
          sub.id === parsedData.studentId ||
          sub.id === parsedData.userId ||
          sub.id === parsedData.id ||
          sub.email === parsedData.email ||
          sub.email === parsedData.studentEmail ||
          sub.name === parsedData.name ||
          sub.name === parsedData.studentName
        )
        
        // If not found by direct fields, try matching with formData
        if (!student && parsedData.formData) {
          // Look for name/email in formData values
          const formDataValues = Object.values(parsedData.formData)
          console.log('🔍 FormData values to match:', formDataValues)
          console.log('📋 Available students for formData matching:', submissions.map(s => ({ name: s.name, email: s.email })))
          
          student = submissions.find(sub => {
            const match = formDataValues.some(value => {
              const valueStr = String(value).toLowerCase()
              const nameMatch = sub.name?.toLowerCase().includes(valueStr) || valueStr.includes(sub.name?.toLowerCase() || '')
              const emailMatch = sub.email?.toLowerCase().includes(valueStr) || valueStr.includes(sub.email?.toLowerCase() || '')
              
              if (nameMatch || emailMatch) {
                console.log('✅ Matched student:', sub.name, 'with formData value:', value, 'nameMatch:', nameMatch, 'emailMatch:', emailMatch)
              }
              
              return nameMatch || emailMatch
            })
            return match
          })
        }
      }
      
      if (!student) {
        // Try matching with raw text data
        student = submissions.find(sub => 
          sub.id === studentData ||
          sub.email === studentData ||
          sub.name === studentData ||
          sub.name?.toLowerCase().includes(studentData.toLowerCase()) ||
          sub.email?.toLowerCase().includes(studentData.toLowerCase())
        )
      }
      
      if (!student) {
        // Try partial matching for names
        student = submissions.find(sub => 
          sub.name?.toLowerCase().includes(studentData.toLowerCase()) ||
          studentData.toLowerCase().includes(sub.name?.toLowerCase() || '')
        )
      }
      
      console.log('👤 Found student:', student)
      
      if (student) {
        // Check if already marked present today
        const existingRecord = attendanceRecords.find(record => 
          record.studentId === student.id && 
          record.date === selectedDate && 
          record.status === 'present'
        )
        
        if (existingRecord) {
          toast.info(`${student.name || student.email} already marked present today`)
        } else {
          // Auto-mark as present when QR code is scanned
          markAttendance(student.id, 'present')
          toast.success(`✅ Marked ${student.name || student.email} as present!`)
        }
      } else {
        // Show more detailed error with available data
        const availableStudents = submissions.map(sub => ({
          id: sub.id,
          name: sub.name,
          email: sub.email
        }))
        console.log('❌ Available students for debugging:', availableStudents)
        toast.error(`❌ Student not found: "${studentData}". Available: ${submissions.length} students`)
      }
    } catch (error) {
      console.error('❌ Error processing QR code:', error)
      toast.error('Invalid QR code format')
    }
    
    // Clear scanned data after a short delay to allow for new scans
    setTimeout(() => {
      setScannedData('')
    }, 1500)
  }

  const copyLink = () => {
    if (form && form[0]) {
      const publicLink = `${window.location.origin}/form/${form[0].id}`
      navigator.clipboard
        .writeText(publicLink)
        .then(() => {
          toast.success("Form link copied to clipboard!")
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
          toast.error("Failed to copy link")
        })
    }
  }

  const openFormLink = () => {
    if (form && form[0]) {
      const publicLink = `${window.location.origin}/form/${form[0].id}`
      window.open(publicLink, "_blank")
    }
  }

  const handleEditForm = () => {
    router.push(`/form-generator?edit=1&id=${formId}`)
  }

  const handleDeleteForm = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete form")
      }

      toast.success("Form deleted successfully!")
      setShowDeleteDialog(false)
      router.push("/form-management") // Redirect to forms list
    } catch (error) {
      console.error("Delete form error:", error)
      toast.error("Failed to delete form. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const exportSubmissions = () => {
    if (!formData?.fields || submissions.length === 0) {
      toast.error('No submissions to export')
      return
    }

    // Create CSV headers from form fields
    const headers = ['Submission Date', ...formData.fields.map(field => field.label)]
    
    const csvContent = [
      headers,
      ...submissions.map(submission => [
        new Date(submission.submittedAt).toLocaleDateString(),
        ...formData.fields.map(field => {
          const fieldData = submission.fields.find(f => f.label === field.label)
          return fieldData?.value || ''
        })
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.topic}-submissions.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Submissions exported successfully!')
  }

  const toggleSubmissionSelection = (submissionId: string) => {
    setSelectedSubmissions(prev => 
      prev.includes(submissionId) 
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    )
  }

  if (!formId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading form details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md p-8">
          <h1 className="text-xl text-red-500 dark:text-red-400">Error Loading Form</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error instanceof Error ? error.message : "Failed to load form details"}</p>
          <Button onClick={() => window.location.reload()}>
                Try Again
          </Button>
        </Card>
      </div>
    )
  }

  if (!form || !form[0]) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md p-8">
          <h1 className="text-xl text-red-500 dark:text-red-400">Form Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The form you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const formData: FormWithFields = form[0]
  const totalSubmissions = submissions.length
  const recentSubmissions = submissions.filter(sub => 
    new Date(sub.submittedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length
  const uniqueEmails = new Set(submissions.map(sub => sub.email).filter(Boolean)).size
  const uniqueNames = new Set(submissions.map(sub => sub.name).filter(Boolean)).size
  
  // Attendance statistics
  const todayAttendance = attendanceRecords.filter(record => record.date === selectedDate)
  const presentCount = todayAttendance.filter(record => record.status === 'present').length
  const absentCount = todayAttendance.filter(record => record.status === 'absent').length
  const lateCount = todayAttendance.filter(record => record.status === 'late').length

  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ backgroundColor: '#f7f7f7' }}>
      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2 h-8 w-8 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold truncate" style={{ color: '#382606' }}>{formData.topic}</h1>
                <p className="text-xs" style={{ color: '#382606', opacity: 0.7 }}>ቅጽ አስተዳደር</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-gray-200">
                <DropdownMenuItem onClick={copyLink} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                  <Copy className="mr-2 h-4 w-4" />
                  copy link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openFormLink} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  ቅጽ ክፈት
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditForm} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  ቅጽ አርትዕ
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  ቅጽ ሰርዝ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Desktop Back Button */}
        <div className="mb-6 hidden md:block">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            ወደ ቅጾች ተመለስ
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
              <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#382606' }}>{formData.topic}</h1>
              <p className="mt-1" style={{ color: '#382606', opacity: 0.7 }}>{formData.description}</p>
            </div>
                <div className="flex items-center gap-3">
              <Button variant="outline" onClick={copyLink} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Copy className="w-4 h-4 mr-2" />
                copy link
              </Button>
              <Button variant="outline" onClick={handleEditForm} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                ቅጽ አርትዕ
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(true)}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                ቅጽ ሰርዝ
              </Button>
              <Button onClick={openFormLink} className="text-white border-0" style={{ backgroundColor: '#f4be42' }}>
                <ExternalLink className="w-4 h-4 mr-2" />
                ቅጽ ክፈት
              </Button>
                </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#382606', opacity: 0.7 }}>ጠቅላላ ዝርዝር</p>
                  <p className="text-2xl font-bold" style={{ color: '#382606' }}>{totalSubmissions}</p>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-400/30 border-2 border-yellow-400/50 shadow-md">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#382606', opacity: 0.7 }}>ይህ ሳምንት</p>
                  <p className="text-2xl font-bold" style={{ color: '#382606' }}>{recentSubmissions}</p>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-400/30 border-2 border-yellow-400/50 shadow-md">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium" style={{ color: '#382606', opacity: 0.7 }}>የተለያዩ ኢሜይሎች</p>
                  <p className="text-2xl font-bold" style={{ color: '#382606' }}>{uniqueEmails}</p>
              </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f4be42', opacity: 0.2 }}>
                  <Users className="w-5 h-5" style={{ color: '#f4be42' }} />
              </div>
            </div>
            </CardContent>
          </Card> */}

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium" style={{ color: '#382606', opacity: 0.7 }}>ዛሬ የተገኙ</p>
                  <p className="text-2xl font-bold" style={{ color: '#382606' }}>{presentCount}</p>
              </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-400/30 border-2 border-green-400/50 shadow-md">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
            </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium" style={{ color: '#382606', opacity: 0.7 }}>ዛሬ ያልተገኙ</p>
                  <p className="text-2xl font-bold" style={{ color: '#382606' }}>{absentCount}</p>
              </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-400/30 border-2 border-red-400/50 shadow-md">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
            </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium" style={{ color: '#382606', opacity: 0.7 }}>ዛሬ ያረፈደው</p>
                  <p className="text-2xl font-bold" style={{ color: '#382606' }}>{lateCount}</p>
              </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-400/30 border-2 border-orange-400/50 shadow-md">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
            </div>
            </CardContent>
          </Card>
            </div>

        {/* Tabs */}
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border border-gray-200">
            <TabsTrigger 
              value="submissions" 
              className="tabs-trigger data-[state=active]:bg-[#f4be42] data-[state=active]:text-white text-gray-700 hover:text-gray-900"
              style={{ color: '#382606' }}
            >
              ቅጽ ዝርዝር
            </TabsTrigger>
            <TabsTrigger 
              value="attendance" 
              className="tabs-trigger data-[state=active]:bg-[#f4be42] data-[state=active]:text-white text-gray-700 hover:text-gray-900"
              style={{ color: '#382606' }}
            >
              አቴንዳንስ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: '#382606' }}>ቅጽ ዝርዝር</CardTitle>
                  <Button onClick={exportSubmissions} variant="outline" disabled={submissions.length === 0} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    CSV ወደ ውጭ ላክ
                  </Button>
          </div>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2" style={{ color: '#382606' }}>እስካሁን ዝርዝር የለም</h3>
                    <p style={{ color: '#382606', opacity: 0.7 }}>ተጠቃሚዎች ቅጽዎን ሲሞሉ፣ ምላሾቻቸው እዚህ ይታያሉ።</p>
        </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => {
                      const isExpanded = expandedSubmission === submission.id
                      const qrCodeUrl = generateSubmissionQR(submission)
                      const studentName = submission.name || submission.fields[0]?.value || `Student ${submission.id.slice(-6)}`
                      
                      return (
                        <div key={submission.id} className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                          {/* Main Submission Card */}
                          <div 
                            className="p-4 cursor-pointer"
                            onClick={() => setExpandedSubmission(isExpanded ? null : submission.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={selectedSubmissions.includes(submission.id)}
                                  onCheckedChange={(checked) => {
                                    toggleSubmissionSelection(submission.id)
                                  }}
                                  className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:border-blue-500"
                                />
            <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {studentName}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {submission.email || 'No email provided'}
                                  </div>
                                </div>
            </div>
            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                  <QrCode className="w-4 h-4" />
                                  <span className="hidden sm:inline">Click to view QR</span>
                                </div>
                                <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                  {new Date(submission.submittedAt).toLocaleDateString()}
              </Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(submission.submittedAt).toLocaleTimeString()}
                                </span>
            </div>
          </div>
          
                            {/* Show form fields and values */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              {submission.fields.map((field, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">{field.label}:</span>
                                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                                    {field.value || 'Not provided'}
                                  </span>
                                </div>
                              ))}
                            </div>
            </div>

                          {/* Expanded QR Code Section */}
                          {isExpanded && (
                            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-4">
                              <div className="flex flex-col sm:flex-row items-start gap-4">
                                {/* QR Code */}
                                <div className="flex-shrink-0">
                                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                    <div className="text-center space-y-3">
                                      <h4 className="font-medium text-gray-900 dark:text-white">Attendance QR Code</h4>
                                      <img 
                                        src={qrCodeUrl} 
                                        alt={`QR Code for ${studentName}`}
                                        className="w-32 h-32 mx-auto"
                                      />
                                      <div className="flex items-center justify-center gap-2">
              <Button
                                          onClick={() => downloadQRCode(qrCodeUrl, studentName)}
                variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                                          <DownloadIcon className="w-3 h-3" />
                                          Download
              </Button>
              <Button
                                          onClick={() => {
                                            navigator.clipboard.writeText(qrCodeUrl)
                                            toast.success(`QR code URL for ${studentName} copied!`)
                                          }}
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                          <Copy className="w-3 h-3" />
                                          Copy URL
              </Button>
                                      </div>
            </div>
          </div>
        </div>

                                {/* QR Code Information */}
                                <div className="flex-1 space-y-3">
            <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">QR Code Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Student Name:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{studentName}</span>
            </div>
                                      {submission.email && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                          <span className="font-medium text-gray-900 dark:text-white">{submission.email}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Submission ID:</span>
                                        <span className="font-mono text-xs text-gray-900 dark:text-white">{submission.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">QR Code Type:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">Attendance</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* QR Code Data Preview */}
                                  <div>
                                    <details className="text-sm">
                                      <summary className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 font-medium">
                                        View QR Code Data
                                      </summary>
                                      <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-xs font-mono text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                                        {JSON.stringify({
                                          userId: submission.id,
                                          formId: formId,
                                          formData: submission.fields.reduce((acc: any, field: any) => {
                                            acc[field.label || field.id] = field.value
                                            return acc
                                          }, {})
                                        }, null, 2)}
                                      </div>
                                    </details>
                                  </div>
                                  
                                  {/* Instructions */}
                                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                    <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-1">How to use:</h5>
                                    <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                                      <li>• Download or print this QR code</li>
                                      <li>• Student presents QR code for attendance</li>
                                      <li>• Scan with attendance scanner</li>
                                      <li>• Student will be automatically marked present</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2" style={{ color: '#382606' }}>
                    <Calendar className="w-5 h-5" />
                    አቴንዳንስ አስተዳደር
                  </CardTitle>
                  
                  {/* Mobile: Stack controls vertically */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Date and Filter Row */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <select
                        value={attendanceFilter}
                        onChange={(e) => setAttendanceFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4be42] focus:border-transparent text-sm bg-white text-gray-900"
                      >
                        <option value="all">ሁሉም ሁኔታ</option>
                        <option value="present">የተገኘ</option>
                        <option value="absent">ያልተገኘ</option>
                        <option value="late">ያረፈደ</option>
                      </select>
                    </div>
                    
                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={openQRScanner} 
                        variant="outline" 
                        size="sm"
                        className="attendance-action-button flex items-center gap-2"
                      >
                        <Scan className="w-4 h-4" />
                        <span className="hidden sm:inline">ተማሪ QR አንብብ</span>
                      </Button>
                      <Button 
                        onClick={markAllPresent} 
                        variant="outline" 
                        size="sm" 
                        className="attendance-action-button"
                      >
                        <span className="hidden sm:inline">ሁሉንም የተገኘ ምልክት አድርግ</span>
                        <span className="sm:hidden">ሁሉም የተገኘ</span>
                      </Button>
                      <Button 
                        onClick={markAllAbsent} 
                        variant="outline" 
                        size="sm" 
                        className="attendance-action-button"
                      >
                        <span className="hidden sm:inline">ሁሉንም ያልተገኘ ምልክት አድርግ</span>
                        <span className="sm:hidden">ሁሉም ያልተገኘ</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {attendanceLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#f4be42' }} />
                    <span className="ml-2" style={{ color: '#382606', opacity: 0.7 }}>አቴንዳንስ ዳታ በመጫን ላይ...</span>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2" style={{ color: '#382606' }}>ተማሪዎች አልተመዘገቡም</h3>
                    <p style={{ color: '#382606', opacity: 0.7 }}>አቴንዳንስን ለመከታተል ተማሪዎች በመጀመሪያ ቅጹን ማስገባት አለባቸው።</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => {
                      const attendanceRecord = filteredAttendanceRecords.find(
                        record => record.studentId === submission.id
                      )
                      const currentStatus = attendanceRecord?.status as 'present' | 'absent' | 'late' | null
                      
                      return (
                        <div key={submission.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow gap-3 bg-white dark:bg-gray-800">
                          {/* Student Info */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 dark:text-white truncate">
                                {submission.name || submission.fields[0].value || `Student ${submission.id.slice(-6)}`}
                      </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {submission.email || 'No email provided'}
                    </div>
                  </div>
                          </div>
                          
                          {/* Status Badge - Mobile */}
                          {currentStatus && (
                            <div className="sm:hidden">
                              <Badge 
                                variant={currentStatus === 'present' ? 'default' : 'secondary'}
                                className={
                                  currentStatus === 'present' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                                  currentStatus === 'absent' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                                  'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                                }
                              >
                                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </Badge>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            {/* Mobile: Stack buttons vertically */}
                            <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-2">
                              <Button
                                size="sm"
                                variant={currentStatus === 'present' ? 'default' : 'outline'}
                                onClick={() => markAttendance(submission.id, 'present')}
                                className={`${
                                  currentStatus === 'present' 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'attendance-action-button border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                } text-xs sm:text-sm`}
                                style={currentStatus !== 'present' ? {
                                  color: '#374151',
                                  borderColor: '#d1d5db',
                                  backgroundColor: 'transparent'
                                } : {}}
                              >
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">የተገኘ</span>
                                <span className="sm:hidden">የ</span>
                              </Button>
                              <Button
                                size="sm"
                                variant={currentStatus === 'absent' ? 'default' : 'outline'}
                                onClick={() => markAttendance(submission.id, 'absent')}
                                className={`${
                                  currentStatus === 'absent' 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'attendance-action-button border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                } text-xs sm:text-sm`}
                                style={currentStatus !== 'absent' ? {
                                  color: '#374151',
                                  borderColor: '#d1d5db',
                                  backgroundColor: 'transparent'
                                } : {}}
                              >
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">ያልተገኘ</span>
                                <span className="sm:hidden">ያ</span>
                              </Button>
                              <Button
                                size="sm"
                                variant={currentStatus === 'late' ? 'default' : 'outline'}
                                onClick={() => markAttendance(submission.id, 'late')}
                                className={`${
                                  currentStatus === 'late' 
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                    : 'attendance-action-button border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                } text-xs sm:text-sm`}
                                style={currentStatus !== 'late' ? {
                                  color: '#374151',
                                  borderColor: '#d1d5db',
                                  backgroundColor: 'transparent'
                                } : {}}
                              >
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">ያረፈደ</span>
                                <span className="sm:hidden">የተ</span>
                              </Button>
                </div>
                            
                            {/* Desktop: Status Badge */}
                            {currentStatus && (
                              <div className="hidden sm:block">
                                <Badge 
                                  variant={currentStatus === 'present' ? 'default' : 'secondary'}
                                  className={
                                    currentStatus === 'present' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                                    currentStatus === 'absent' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                                    'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                                  }
                                >
                                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                                </Badge>
            </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
            </div>
          )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 qr-scanner-modal"
          style={{ zIndex: 10000 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full border-2 border-gray-300 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">ተማሪ QR ኮድ አንብብ</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={closeQRScanner}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-400 font-semibold"
              >
                <X className="w-5 h-5 font-bold" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
                <QRScanner onScan={handleQRScan} />
              </div>
              <p className="text-sm text-center text-gray-800 font-bold">
                ተማሪውን የተገኘ ምልክት ለማድረግ በተማሪው QR ኮድ ላይ ካሜራውን ያቅኑ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteForm}
        title="ቅጽ ሰርዝ"
        description="ይህን ቅጽ መሰረዝ እርግጠኛ ነዎት? ይህ እርምጃ ሊመለስ አይችልም እና ቅጹን እና ሁሉንም ዳታውን ዝርዝርን እና የአቴንዳንስ ምዝግብሮችን በቋሚነት ያስወግዳል።"
        confirmText="ቅጽ ሰርዝ"
        cancelText="ሰርዝ"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  )
}
