import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../../contexts/ToastContext';
import Spinner from '../../components/Spinner';

export default function PublicChecklist() {
  const [checklist, setChecklist] = useState(null);
  const [responses, setResponses] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { token } = router.query;
  const { showToast } = useToast();

  useEffect(() => {
    if (!token) return;
    
    const fetchChecklist = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/checklists/public/${token}`);
        
        if (!res.ok) {
          throw new Error('Checklist não encontrado');
        }
        
        const data = await res.json();
        setChecklist(data);
        
        // Inicializar as respostas
        const initialResponses = {};
        JSON.parse(data.fields).forEach(field => {
          initialResponses[field.label] = '';
        });
        setResponses(initialResponses);
      } catch (err) {
        setError(err.message || 'Erro ao carregar checklist');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChecklist();
  }, [token]);

  const handleTextChange = (fieldName, value) => {
    setResponses(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleFileChange = (fieldName, file) => {
    setFiles(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate responses
    const requiredTextFields = JSON.parse(checklist.fields)
      .filter(field => field.type === 'text' && field.required)
      .map(field => field.label);
    
    const missingFields = requiredTextFields.filter(field => !responses[field]);
    
    if (missingFields.length > 0) {
      const errorMsg = `Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`;
      setError(errorMsg);
      showToast(errorMsg, 'warning');
      return;
    }
    
    try {
      setSubmitting(true);
      // Create a FormData instance to handle both text responses and files
      const formData = new FormData();
      
      // Add checklist token and text responses
      formData.append('token', token);
      formData.append('textResponses', JSON.stringify(responses));
      
      // Add files
      Object.entries(files).forEach(([fieldName, file]) => {
        if (file) {
          formData.append(`file_${fieldName}`, file);
        }
      });
      
      const res = await fetch(`/api/checklists/public/${token}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error('Erro ao enviar respostas');
      }
      
      setSuccess(true);
      showToast('Suas respostas foram enviadas com sucesso!', 'success');
      window.scrollTo(0, 0);
    } catch (err) {
      const errorMsg = err.message || 'Erro ao enviar respostas';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <Spinner size="lg" color="blue" />
          <p className="mt-4 text-gray-600">Carregando seu checklist...</p>
        </div>
      </div>
    );
  }

  if (error && !checklist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Erro</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
          <h2 className="text-xl font-semibold text-green-500 mb-2">Enviado com sucesso!</h2>
          <p>Suas informações foram enviadas com sucesso. Entraremos em contato em breve.</p>
        </div>
      </div>
    );
  }

  if (!checklist) return null;

  const fields = JSON.parse(checklist.fields);

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2 text-center">{checklist.clientName}</h2>
        <p className="text-center text-gray-600 mb-6">{checklist.serviceType}</p>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {fields.map((field, idx) => (
            <div key={idx} className="mb-4">
              <label className="block font-medium mb-1">{field.label}</label>
              {field.type === 'text' ? (
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={responses[field.label] || ''}
                  onChange={(e) => handleTextChange(field.label, e.target.value)}
                  required
                />
              ) : (
                <input
                  type="file"
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleFileChange(field.label, e.target.files[0])}
                  required
                />
              )}
            </div>
          ))}
          
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center transition-all duration-200 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner size="sm" color="white" />
                <span className="ml-2">Enviando...</span>
              </>
            ) : (
              'Enviar Respostas'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
