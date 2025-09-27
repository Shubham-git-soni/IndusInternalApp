'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building2, Award, User, FileText, Users, CreditCard, IndianRupee } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient, type Employee } from '@/services/api';

export default function TeamMemberProfilePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee data from backend
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeData = await apiClient.getEmployeeById(Number(employeeId));
        // Convert API response to expected format
        setEmployee({
          ...employeeData,
          // Add mock additional fields that backend doesn't provide yet
          personalEmail: 'john.smith@gmail.com',
          dateOfBirth: '1990-05-15',
          gender: 'Male',
          bloodGroup: 'O+',
          maritalStatus: 'Married',
          weddingDate: '2018-12-10',
          currentAddress: '123 Main Street, Apartment 4B, New York, NY 10001',
          permanentAddress: '456 Oak Avenue, Springfield, IL 62701',
          department: { id: 1, name: employeeData.department },
          designation: { id: 2, name: employeeData.designation },
          manager: { id: 2, name: employeeData.managerName, email: 'manager@company.com' },
          joiningDate: employeeData.joiningDate,
          confirmationDate: '2023-07-15',
          employeeType: 'Permanent',
          workLocation: 'New York Office',
          uanNumber: 'UAN123456789',
          panCardNumber: 'ABCDE1234F',
          aadharCardNumber: '1234-5678-9012',
          role: { id: 1, name: 'Team Member' },
          bankName: 'State Bank of India',
          accountNumber: '1234567890123',
          ifscCode: 'SBIN0001234',
          // Salary Information
          annualCTC: 1200000,
          basicSalary: 480000,
          hra: 240000,
          pfDeduction: 57600,
          professionalTax: 2400,
          otherAllowances: 420000,
          isLoginEnabled: true,
          createdAt: '2023-01-15T00:00:00Z'
        });
      } catch (error) {
        console.error('Failed to fetch employee:', error);
        // No fallback - employee will be null
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Mock family members data
  const familyMembers = [
    {
      id: 1,
      fullName: 'Jane Smith',
      relationship: 'Spouse',
      dateOfBirth: '1992-08-20',
      gender: 'Female',
      isNominee: true,
      isDependent: true
    },
    {
      id: 2,
      fullName: 'Alex Smith',
      relationship: 'Child',
      dateOfBirth: '2020-03-10',
      gender: 'Male',
      isNominee: false,
      isDependent: true
    }
  ];

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'personal', name: 'Personal Details', icon: FileText },
    { id: 'job', name: 'Job Information', icon: Building2 },
    { id: 'bank', name: 'Bank Details', icon: CreditCard },
    { id: 'family', name: 'Family Members', icon: Users },
    { id: 'salary', name: 'Salary Information', icon: IndianRupee }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'resigned':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <DashboardLayout>
      {/* Custom CSS for scrollbar hiding */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="pt-16 pb-24 lg:pb-4 px-3 sm:px-4 space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="pt-2 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <button
                onClick={() => router.back()}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Team Member Profile</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage team member information</p>
              </div>
            </div>
            {!loading && (
              <Link
                href={`/hrm/employees/${employeeId}/edit`}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Team Member</span>
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full self-center sm:self-auto"></div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2 mx-auto sm:mx-0"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 mx-auto sm:mx-0"></div>
                    <div className="h-3 bg-gray-200 rounded w-40 mx-auto sm:mx-0"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : employee ? (
          <>

        {/* Profile Header Card - Mobile Optimized */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full flex items-center justify-center self-center sm:self-auto">
                  <span className="text-white font-bold text-lg sm:text-xl">
                    {getInitials(employee.fullName)}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{employee.fullName}</h2>
                    <span className={getStatusBadge(employee.status)}>{employee.status}</span>
                  </div>
                  <div className="space-y-2 sm:space-y-1 text-sm text-gray-600">
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <span className="flex items-center justify-center sm:justify-start">
                        <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-center sm:text-left">{employee.department.name} • {employee.designation.name}</span>
                      </span>
                      <span className="flex items-center justify-center sm:justify-start">
                        <Award className="w-4 h-4 mr-2 flex-shrink-0" />
                        Employee ID: {employee.userId}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <span className="flex items-center justify-center sm:justify-start">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{employee.email}</span>
                      </span>
                      <span className="flex items-center justify-center sm:justify-start sm:hidden lg:flex">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        {employee.phoneNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Joining Date</p>
                  <p className="text-lg font-bold text-blue-900">
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Experience</p>
                  <p className="text-lg font-bold text-green-900">
                    {Math.floor((Date.now() - new Date(employee.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} Years
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Team Member Type</p>
                  <p className="text-lg font-bold text-purple-900">{employee.employeeType}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Location</p>
                  <p className="text-lg font-bold text-orange-900">{employee.workLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation and Content */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          {/* Tab Navigation - Mobile Optimized with Horizontal Scroll */}
          <div className="border-b border-gray-200 relative">
            {/* Left fade indicator for mobile */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none sm:hidden"></div>
            {/* Right fade indicator for mobile */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none sm:hidden"></div>

            <nav
              className="flex px-4 sm:px-6 overflow-x-auto hide-scrollbar"
              aria-label="Tabs"
              style={{
                WebkitOverflowScrolling: 'touch', /* iOS smooth scrolling */
              }}
            >
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-2 sm:mr-6 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0`}
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Employee ID</span>
                        <span className="text-sm text-gray-900">{employee.userId}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Department</span>
                        <span className="text-sm text-gray-900">{employee.department.name}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Designation</span>
                        <span className="text-sm text-gray-900">{employee.designation.name}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Manager</span>
                        <span className="text-sm text-gray-900">{employee.manager?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Work Location</span>
                        <span className="text-sm text-gray-900">{employee.workLocation}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">Login Access</span>
                        <span className={`text-sm ${employee.isLoginEnabled ? 'text-green-600' : 'text-red-600'}`}>
                          {employee.isLoginEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Official Email</p>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                        </div>
                      </div>
                      {employee.personalEmail && (
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Personal Email</p>
                            <p className="text-sm text-gray-600">{employee.personalEmail}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone Number</p>
                          <p className="text-sm text-gray-600">{employee.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Address</p>
                          <p className="text-sm text-gray-600">{employee.currentAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Details Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                        <span className="text-sm text-gray-900">
                          {new Date(employee.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Gender</span>
                        <span className="text-sm text-gray-900">{employee.gender}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Blood Group</span>
                        <span className="text-sm text-gray-900">{employee.bloodGroup}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Marital Status</span>
                        <span className="text-sm text-gray-900">{employee.maritalStatus}</span>
                      </div>
                      {employee.weddingDate && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm font-medium text-gray-500">Wedding Date</span>
                          <span className="text-sm text-gray-900">
                            {new Date(employee.weddingDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Government Documents</h3>
                    <div className="space-y-3">
                      {employee.panCardNumber && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-500">PAN Card</span>
                          <span className="text-sm text-gray-900">{employee.panCardNumber}</span>
                        </div>
                      )}
                      {employee.aadharCardNumber && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-500">Aadhar Card</span>
                          <span className="text-sm text-gray-900">{employee.aadharCardNumber}</span>
                        </div>
                      )}
                      {employee.uanNumber && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm font-medium text-gray-500">UAN Number</span>
                          <span className="text-sm text-gray-900">{employee.uanNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Current Address</h4>
                      <p className="text-sm text-gray-600">{employee.currentAddress}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Permanent Address</h4>
                      <p className="text-sm text-gray-600">{employee.permanentAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Information Tab */}
            {activeTab === 'job' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Joining Date</span>
                        <span className="text-sm text-gray-900">
                          {new Date(employee.joiningDate).toLocaleDateString()}
                        </span>
                      </div>
                      {employee.confirmationDate && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-500">Confirmation Date</span>
                          <span className="text-sm text-gray-900">
                            {new Date(employee.confirmationDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Team Member Type</span>
                        <span className="text-sm text-gray-900">{employee.employeeType}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Work Location</span>
                        <span className="text-sm text-gray-900">{employee.workLocation}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">Role</span>
                        <span className="text-sm text-gray-900">{employee.role.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Reporting Structure</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">Reports To</p>
                            <p className="text-lg font-bold text-blue-800">
                              {employee.manager?.name || 'No Manager Assigned'}
                            </p>
                            {employee.manager?.email && (
                              <p className="text-sm text-blue-600">{employee.manager.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Details Tab */}
            {activeTab === 'bank' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Bank Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Bank Name</span>
                        <span className="text-sm text-gray-900">{employee.bankName}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Account Number</span>
                        <span className="text-sm text-gray-900 font-mono">
                          {employee.accountNumber ? `****${employee.accountNumber.slice(-4)}` : 'Not provided'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">IFSC Code</span>
                        <span className="text-sm text-gray-900 font-mono">{employee.ifscCode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Bank Documents</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                        <h4 className="mt-2 text-sm font-medium text-gray-900">Bank Documents</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Bank statements and account verification documents
                        </p>
                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          View Documents
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Family Members Tab */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
                </div>

                {familyMembers.length > 0 ? (
                  <div className="grid gap-4">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{member.fullName}</h4>
                              <p className="text-sm text-gray-600">{member.relationship} • {member.gender}</p>
                              <p className="text-sm text-gray-500">
                                Born: {new Date(member.dateOfBirth).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {member.isNominee && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Nominee
                              </span>
                            )}
                            {member.isDependent && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Dependent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No family members</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add family members for emergency contacts and nominee details.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Salary Information Tab */}
            {activeTab === 'salary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Salary Structure</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Annual CTC</span>
                        <span className="text-sm text-gray-900 font-semibold">
                          ₹{employee.annualCTC?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Monthly Gross</span>
                        <span className="text-sm text-gray-900">
                          ₹{employee.annualCTC ? Math.round(employee.annualCTC / 12).toLocaleString() : 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Basic Salary</span>
                        <span className="text-sm text-gray-900">
                          ₹{employee.basicSalary?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">HRA</span>
                        <span className="text-sm text-gray-900">
                          ₹{employee.hra?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">Other Allowances</span>
                        <span className="text-sm text-gray-900">
                          ₹{employee.otherAllowances?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Deductions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">PF Deduction</span>
                        <span className="text-sm text-red-600">
                          -₹{employee.pfDeduction?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Professional Tax</span>
                        <span className="text-sm text-red-600">
                          -₹{employee.professionalTax?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500">Net Monthly Salary</span>
                        <span className="text-sm text-green-600 font-semibold">
                          ₹{employee.annualCTC ?
                            Math.round((employee.annualCTC - (employee.pfDeduction || 0) - (employee.professionalTax || 0)) / 12).toLocaleString()
                            : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Summary Card */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Salary Summary</h4>
                      <p className="text-sm text-gray-600 mt-1">Complete salary breakdown</p>
                    </div>
                    <IndianRupee className="w-8 h-8 text-blue-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 sm:p-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Annual CTC</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        ₹{employee.annualCTC?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly Gross</p>
                      <p className="text-lg font-bold text-green-600 mt-1">
                        ₹{employee.annualCTC ? Math.round(employee.annualCTC / 12).toLocaleString() : '0'}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Deductions</p>
                      <p className="text-lg font-bold text-red-600 mt-1">
                        ₹{((employee.pfDeduction || 0) + (employee.professionalTax || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Net Monthly</p>
                      <p className="text-lg font-bold text-purple-600 mt-1">
                        ₹{employee.annualCTC ?
                          Math.round((employee.annualCTC - (employee.pfDeduction || 0) - (employee.professionalTax || 0)) / 12).toLocaleString()
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">Employee not found</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}