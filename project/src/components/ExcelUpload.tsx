import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';

const ExcelUpload: React.FC = () => {
  const [data, setData] = useState<any[][]>([]);
  const [error, setError] = useState('');

  // ✅ Load data from localStorage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem('excelData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  // ✅ Save data to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('excelData', JSON.stringify(data));
  }, [data]);

  // 📤 Handle Excel file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx')) {
      setError('Please upload a valid .xlsx file');
      setData([]);
      return;
    }

    setError('');
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer;
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];

      const rows: any[][] = [];
      worksheet.eachRow((row) => {
        rows.push(row.values.slice(1)); // Remove the null index
      });

      setData(rows);
    };

    reader.readAsArrayBuffer(file);
  };

  // ❌ Handle delete with confirmation
  const handleDeleteData = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete all data?');
    if (confirmDelete) {
      localStorage.removeItem('excelData');
      setData([]);
    }
  };

  // 📥 Export to Excel
  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Exported Data');

    data.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_data.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <h2>Upload Payroll Excel File</h2>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        style={styles.fileInput}
      />
      <div style={styles.buttonRow}>
        <button onClick={handleDeleteData} style={styles.deleteButton}>
          Delete Data
        </button>
        {data.length > 0 && (
          <button onClick={handleExportToExcel} style={styles.exportButton}>
            Export to Excel
          </button>
        )}
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {data.length > 0 && (
        <table style={styles.table}>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={styles.cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: '2rem auto',
    maxWidth: '700px',
    padding: '1rem',
    textAlign: 'center' as const,
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  fileInput: {
    margin: '1rem 0',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  exportButton: {
    backgroundColor: 'green',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
  },
  cell: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

export default ExcelUpload;
