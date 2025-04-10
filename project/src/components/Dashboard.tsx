import React, { useState, useEffect } from 'react';
import { LogOut, Upload, Download, UserPlus, DollarSign, Trash2, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

interface Employee {
  id: string;
  name: string;
  hoursWorked: number;
  hourlyRate: number;
}

interface DashboardProps {
  onLogout: () => void;
}

const createEmptyEmployee = (): Employee => ({
  id: '',
  name: '',
  hoursWorked: 0,
  hourlyRate: 0,
});

function Dashboard({ onLogout }: DashboardProps) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const storedData = localStorage.getItem('employees');
    return storedData ? JSON.parse(storedData) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>(createEmptyEmployee);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const calculateSalary = (hours: number, rate: number) => hours * rate;
  const formatSalary = (value: number) => `₹${value.toLocaleString('en-IN')}`;
  const formatSalaryForPDF = (value: number) => `Rs. ${value.toLocaleString('en-IN')}`;

  const totalExpense = employees.reduce(
    (sum, emp) => sum + calculateSalary(emp.hoursWorked, emp.hourlyRate),
    0
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      const parsedEmployees: Employee[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const id = row.getCell(1).value?.toString() || '';
        const name = row.getCell(2).value?.toString() || '';
        const hoursWorked = Number(row.getCell(3).value) || 0;
        const hourlyRate = Number(row.getCell(4).value) || 0;

        if (id && name) {
          parsedEmployees.push({ id, name, hoursWorked, hourlyRate });
        }
      });

      setEmployees(parsedEmployees);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployees([...employees, newEmployee]);
    setNewEmployee(createEmptyEmployee());
    setShowAddForm(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Payroll Expenses', 14, 22);

    const tableColumn = ['Employee ID', 'Name', 'Hours Worked', 'Hourly Rate', 'Salary'];
    const tableRows = employees.map(emp => [
      emp.id,
      emp.name,
      emp.hoursWorked,
      formatSalaryForPDF(emp.hourlyRate),
      formatSalaryForPDF(calculateSalary(emp.hoursWorked, emp.hourlyRate)),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    const finalY = (doc as any).lastAutoTable.finalY || 30;
    doc.text(`Total Salary Expense: ${formatSalaryForPDF(totalExpense)}`, 14, finalY + 10);

    doc.save('payroll_dashboard.pdf');
  };

  const generatePayslipPDF = (employee: Employee) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Monthly Payslip', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Details']],
      body: [
        ['Employee ID', employee.id],
        ['Name', employee.name],
        ['Hours Worked', employee.hoursWorked.toString()],
        ['Hourly Rate', formatSalaryForPDF(employee.hourlyRate)],
        ['Salary', formatSalaryForPDF(calculateSalary(employee.hoursWorked, employee.hourlyRate))],
        ['Generated On', new Date().toLocaleDateString()],
      ],
    });

    doc.save(`Payslip_${employee.name}.pdf`);
  };

  const handleClearData = () => {
    setEmployees([]);
    localStorage.removeItem('employees');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900 ml-2">Payroll Dashboard</h1>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Excel
              <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
            </label>

            <button onClick={() => setShowAddForm(true)} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </button>

            <button onClick={handleDownloadPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>

            <button onClick={handleClearData} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Data
            </button>
          </div>

          {/* Add Employee Form */}
          {showAddForm && (
            <div className="mb-6 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Add New Employee</h2>
              <form onSubmit={handleAddEmployee} className="grid grid-cols-2 gap-4">
                {['id', 'name', 'hoursWorked', 'hourlyRate'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field === 'id' ? 'Employee ID' : field === 'name' ? 'Name' : field === 'hoursWorked' ? 'Hours Worked' : 'Hourly Rate'}
                    </label>
                    <input
                      type={field === 'name' || field === 'id' ? 'text' : 'number'}
                      value={(newEmployee as any)[field]}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, [field]: field === 'name' || field === 'id' ? e.target.value : Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                ))}
                <div className="col-span-2 flex justify-end gap-4">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700">
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Employee Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Employee ID', 'Name', 'Hours Worked', 'Hourly Rate', 'Salary', 'Payslip'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.hoursWorked}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatSalary(employee.hourlyRate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatSalary(calculateSalary(employee.hoursWorked, employee.hourlyRate))}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button onClick={() => generatePayslipPDF(employee)} className="flex items-center px-2 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                        <FileText className="h-4 w-4 mr-1" /> Payslip
                      </button>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">No employees added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
