import React, { useCallback } from 'react';
import { Upload, FileText, Download } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string, fileName: string) => void;
  onDownloadSample: () => void;
  loading?: boolean;
}

export function FileUpload({ onFileUpload, onDownloadSample, loading = false }: FileUploadProps) {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content, file.name);
    };
    reader.readAsText(file);
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content, file.name);
    };
    reader.readAsText(file);
  }, [onFileUpload]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-6">
        <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Cargar Archivo de Ventas</h3>
        <p className="text-gray-600">Sube un archivo CSV o TXT delimitado por tabulaciones</p>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          Arrastra tu archivo aquí o haz clic para seleccionar
        </p>
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={loading}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Procesando...' : 'Seleccionar Archivo'}
        </label>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onDownloadSample}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar Ejemplo
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-2 font-medium">El archivo debe contener las columnas principales:</p>
        <div className="grid grid-cols-2 gap-2">
          <ul className="list-disc list-inside space-y-1">
            <li>id_documento</li>
            <li>tipo_documento</li>
            <li>fec_emis</li>
            <li>nombre_vendedor</li>
            <li>nombre_cliente</li>
            <li>nombre_sucursal</li>
          </ul>
          <ul className="list-disc list-inside space-y-1">
            <li>des_art (descripción)</li>
            <li>total_usd</li>
            <li>prec_vta</li>
            <li>monto_imp</li>
            <li>Marcas de Vehiculos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}