# Employee Document Upload - Complete Guide

## Overview
Employee creation with document upload using **Transaction Support** - All or Nothing approach!

---

## 📊 **Data Flow: Employee Creation with Documents**

```
Frontend                          Backend
   │                                 │
   │  Step 1: Upload Files          │
   │  POST /api/fileupload/document │
   │  ────────────────────────────>  │
   │                            FileUploadService
   │                                 │
   │  {filePath, fileName, size}    │
   │  <────────────────────────────  │
   │                                 │
   │  Step 2: Create Employee       │
   │  POST /api/employees            │
   │  with document metadata         │
   │  ────────────────────────────>  │
   │                          EmployeesController
   │                                 │
   │                            EmployeeService
   │                          (Transaction Start)
   │                                 │
   │                          1. Insert Employee
   │                          2. Insert BankDetails
   │                          3. Insert SalaryDetails
   │                          4. Insert FamilyMembers
   │                          5. Insert Documents
   │                                 │
   │                          (Transaction Commit)
   │                                 │
   │  {employeeId, message}         │
   │  <────────────────────────────  │
```

---

## 🚀 **API Endpoints**

### **1. Upload Single Document**
```http
POST /api/fileupload/document
Content-Type: multipart/form-data

FormData:
- file: [file]
- documentType: "AadharCard" | "PanCard" | "BankPassbook" | "Photo"

Response:
{
  "message": "File uploaded successfully",
  "documentType": "AadharCard",
  "fileName": "aadhar.pdf",
  "filePath": "/uploads/documents/guid_aadhar.pdf",
  "fileSize": "245 KB",
  "mimeType": "application/pdf"
}
```

### **2. Upload Multiple Documents**
```http
POST /api/fileupload/documents
Content-Type: multipart/form-data

FormData:
- files: [file1, file2, file3]

Response:
{
  "message": "Uploaded 3 of 3 files",
  "files": [
    {
      "fileName": "aadhar.pdf",
      "filePath": "/uploads/documents/guid_aadhar.pdf",
      "fileSize": "245 KB",
      "mimeType": "application/pdf",
      "success": true
    }
  ]
}
```

### **3. Upload Employee Photo**
```http
POST /api/fileupload/photo
Content-Type: multipart/form-data

FormData:
- file: [image file]

Response:
{
  "message": "Photo uploaded successfully",
  "fileName": "photo.jpg",
  "filePath": "/uploads/photos/guid_photo.jpg",
  "fileSize": "156 KB"
}
```

### **4. Create Employee with Documents**
```http
POST /api/employees
Content-Type: application/json

Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "9876543210",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "departmentId": 1,
  "designationId": 2,
  "joiningDate": "2025-01-01",
  "status": "Active",
  "isLoginEnabled": true,

  // Bank Details
  "bankName": "HDFC Bank",
  "accountNumber": "123456789",
  "ifscCode": "HDFC0001234",

  // Salary Details
  "annualCTC": 600000,
  "basicSalary": 300000,
  "hra": 150000,

  // Family Members
  "familyMembers": [
    {
      "fullName": "Jane Doe",
      "relationship": "Spouse",
      "dateOfBirth": "1992-05-20",
      "gender": "Female",
      "isNominee": true,
      "isDependent": true
    }
  ],

  // Documents (uploaded file paths from step 1)
  "documents": [
    {
      "documentType": "AadharCard",
      "fileName": "aadhar.pdf",
      "filePath": "/uploads/documents/guid_aadhar.pdf",
      "fileSize": "245 KB",
      "mimeType": "application/pdf"
    },
    {
      "documentType": "PanCard",
      "fileName": "pan.pdf",
      "filePath": "/uploads/documents/guid_pan.pdf",
      "fileSize": "180 KB",
      "mimeType": "application/pdf"
    }
  ]
}

Response:
{
  "employeeId": 123,
  "fullName": "John Doe",
  "email": "john@example.com",
  "message": "Employee created successfully with all documents",
  "uploadedDocuments": [
    "AadharCard: aadhar.pdf",
    "PanCard: pan.pdf"
  ]
}
```

---

## 🔐 **File Upload Rules**

### **Document Files**
- **Allowed Extensions**: `.pdf`, `.jpg`, `.jpeg`, `.png`, `.doc`, `.docx`
- **Max Size**: 5 MB
- **Storage Location**: `wwwroot/uploads/documents/`

### **Photo Files**
- **Allowed Extensions**: `.jpg`, `.jpeg`, `.png`
- **Max Size**: 2 MB
- **Storage Location**: `wwwroot/uploads/photos/`

---

## 🔄 **Transaction Support**

### **What is Transaction?**
**All operations succeed together OR all fail together!**

```csharp
using (SqlTransaction transaction = conn.BeginTransaction())
{
    try
    {
        // Step 1: Insert Employee
        // Step 2: Insert Bank Details
        // Step 3: Insert Salary Details
        // Step 4: Insert Family Members
        // Step 5: Insert Documents

        // ✅ All successful? Commit!
        transaction.Commit();
    }
    catch (Exception)
    {
        // ❌ Any error? Rollback everything!
        transaction.Rollback();
        throw;
    }
}
```

### **Example Scenarios:**

#### ✅ **Scenario 1: Success**
```
Employee Created ✓
Bank Details Added ✓
Salary Details Added ✓
Documents Added ✓
→ Transaction Committed ✓
→ Employee Created Successfully!
```

#### ❌ **Scenario 2: Failure**
```
Employee Created ✓
Bank Details Added ✓
Salary Details Failed ✗ (Invalid data)
→ Transaction Rolled Back
→ Employee Deleted (automatically)
→ Bank Details Deleted (automatically)
→ Error returned to frontend
```

---

## 📁 **Folder Structure**

```
backend/Indus.Api/
├── Controllers/
│   ├── EmployeesController.cs      # POST /api/employees
│   └── FileUploadController.cs     # File upload endpoints
├── Services/
│   ├── EmployeeService.cs          # Transaction logic
│   └── FileUploadService.cs        # File handling
├── Repositories/
│   ├── EmployeeRepositoryAdo.cs
│   └── EmployeeDocumentRepositoryAdo.cs
├── DTOs/
│   └── Employee/
│       ├── CreateEmployeeWithDocumentsDto.cs
│       ├── DocumentUploadDto.cs
│       └── CreateEmployeeResponseDto.cs
├── Interfaces/
│   ├── IEmployeeService.cs
│   ├── IFileUploadService.cs
│   └── IEmployeeDocumentRepository.cs
└── wwwroot/
    └── uploads/
        ├── documents/              # Uploaded documents
        └── photos/                 # Uploaded photos
```

---

## 💻 **Frontend Implementation Example**

### **Step-by-Step Process**

```typescript
// Step 1: Upload documents first
const uploadDocument = async (file: File, documentType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  const response = await fetch('http://localhost:5153/api/fileupload/document', {
    method: 'POST',
    body: formData
  });

  return await response.json();
};

// Step 2: Upload all documents
const aadharFile = document.getElementById('aadhar').files[0];
const panFile = document.getElementById('pan').files[0];

const aadharUpload = await uploadDocument(aadharFile, 'AadharCard');
const panUpload = await uploadDocument(panFile, 'PanCard');

// Step 3: Create employee with document metadata
const employeeData = {
  fullName: "John Doe",
  email: "john@example.com",
  password: "password123",
  departmentId: 1,
  designationId: 2,
  joiningDate: "2025-01-01",
  status: "Active",

  // Add uploaded document info
  documents: [
    {
      documentType: aadharUpload.documentType,
      fileName: aadharUpload.fileName,
      filePath: aadharUpload.filePath,
      fileSize: aadharUpload.fileSize,
      mimeType: aadharUpload.mimeType
    },
    {
      documentType: panUpload.documentType,
      fileName: panUpload.fileName,
      filePath: panUpload.filePath,
      fileSize: panUpload.fileSize,
      mimeType: panUpload.mimeType
    }
  ]
};

// Create employee
const response = await fetch('http://localhost:5153/api/employees', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(employeeData)
});

const result = await response.json();
console.log('Employee created:', result);
```

---

## ✅ **Key Features**

1. **Transaction Support** - All or nothing approach
2. **File Upload Service** - Reusable file handling
3. **Document Repository** - Separate layer for document operations
4. **Clean Architecture** - Controller → Service → Repository → DB
5. **No SQL in Controllers** - All queries in repositories
6. **DTOs for Everything** - Type-safe data transfer
7. **Error Handling** - Automatic rollback on failure

---

## 🎯 **Document Types**

Supported document types:
- `AadharCard`
- `PanCard`
- `BankPassbook`
- `Photo`
- `EducationCertificate`
- `ExperienceLetter`
- `ResignationLetter`
- `Other`

---

## 🔒 **Security Notes**

1. ✅ **File Validation** - Only allowed extensions
2. ✅ **Size Limits** - Documents: 5MB, Photos: 2MB
3. ✅ **Unique Filenames** - GUID prefix to avoid conflicts
4. ✅ **Separate Folders** - Documents and photos in different folders
5. ⚠️ **Password Hashing** - TODO: Hash passwords before storing!

---

## 📝 **Testing with Postman**

### Test 1: Upload Document
```
POST http://localhost:5153/api/fileupload/document
Body: form-data
  - file: [Select File]
  - documentType: AadharCard
```

### Test 2: Create Employee
```
POST http://localhost:5153/api/employees
Body: raw (JSON)
{
  "fullName": "Test User",
  "email": "test@test.com",
  "password": "test123",
  "departmentId": 1,
  "designationId": 1,
  "joiningDate": "2025-01-01",
  "documents": [
    {
      "documentType": "AadharCard",
      "fileName": "test.pdf",
      "filePath": "/uploads/documents/guid_test.pdf",
      "fileSize": "100 KB",
      "mimeType": "application/pdf"
    }
  ]
}
```

---

## 🎉 **Summary**

Your complete employee document upload system is ready with:
- ✅ File upload endpoints
- ✅ Transaction-safe employee creation
- ✅ Document repository
- ✅ Clean architecture
- ✅ Error handling
- ✅ Type-safe DTOs

Everything follows the **Controller → Service → Repository → DB** pattern! 🚀
