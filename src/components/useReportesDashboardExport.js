import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

export default function useReportesDashboardExport({ dashboardRef, reservas, eventos, feedbacks, canchas, usuarios }) {
  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save('reporte-epn.pdf');
  };

  const exportToExcel = (type) => {
    let data = [];
    if (type === 'reservas') {
      data = reservas.map(r => {
        const cancha = canchas.find(c => c.id === r.cancha_id) || r.cancha;
        const usuario = usuarios.find(u => u.id === r.usuario_id) || r.usuario;
        return {
          'ID Reserva': r.id,
          'Fecha': r.fecha,
          'Hora inicio': r.hora_inicio,
          'Hora fin': r.hora_fin,
          'Estado': r.estado,
          'Usuario ID': usuario?.id || r.usuario_id,
          'Usuario Nombre': usuario?.nombres || usuario?.nombre || '',
          'Usuario Correo': usuario?.correo || '',
          'Usuario Código': usuario?.codigo || '',
          'Usuario Rol': usuario?.rol?.nombre || usuario?.rol || '',
          'Cancha ID': cancha?.id || r.cancha_id,
          'Cancha Nombre': cancha?.nombre || '',
          'Cancha Capacidad': cancha?.capacidad || '',
          'Tipo Espacio': cancha?.tipoEspacio?.nombre || '',
          'Estado Cancha': cancha?.estadoCancha?.nombre || '',
          'Ubicación': cancha?.ubicacion_referencia || '',
          'Descripción Cancha': cancha?.descripcion || ''
        };
      });
    } else if (type === 'eventos') {
      data = eventos.map(e => {
        const cancha = canchas.find(c => c.id === e.cancha_id) || e.cancha;
        return {
          'ID Evento': e.id,
          'Nombre': e.nombre,
          'Tipo': e.tipo,
          'Descripción': e.descripcion || '',
          'Fecha inicio': e.fecha_inicio,
          'Fecha fin': e.fecha_fin,
          'Hora inicio': e.hora_inicio,
          'Hora fin': e.hora_fin,
          'Estado': e.estado,
          'Cancha ID': cancha?.id || e.cancha_id,
          'Cancha Nombre': cancha?.nombre || '',
          'Cancha Capacidad': cancha?.capacidad || '',
          'Tipo Espacio': cancha?.tipoEspacio?.nombre || '',
          'Estado Cancha': cancha?.estadoCancha?.nombre || '',
          'Ubicación': cancha?.ubicacion_referencia || '',
          'Descripción Cancha': cancha?.descripcion || ''
        };
      });
    } else if (type === 'feedbacks') {
      data = feedbacks.map(f => {
        const cancha = canchas.find(c => c.id === f.cancha_id) || f.cancha;
        const usuario = usuarios.find(u => u.id === f.usuario_id) || f.usuario;
        return {
          'ID Feedback': f.id,
          'Fecha': f.fecha,
          'Calificación': f.calificacion,
          'Comentario': f.comentario,
          'Respuesta': f.respuesta || '',
          'Usuario ID': usuario?.id || f.usuario_id,
          'Usuario Nombre': usuario?.nombres || usuario?.nombre || '',
          'Usuario Correo': usuario?.correo || '',
          'Usuario Código': usuario?.codigo || '',
          'Usuario Rol': usuario?.rol?.nombre || usuario?.rol || '',
          'Cancha ID': cancha?.id || f.cancha_id,
          'Cancha Nombre': cancha?.nombre || '',
          'Cancha Capacidad': cancha?.capacidad || '',
          'Tipo Espacio': cancha?.tipoEspacio?.nombre || '',
          'Estado Cancha': cancha?.estadoCancha?.nombre || '',
          'Ubicación': cancha?.ubicacion_referencia || '',
          'Descripción Cancha': cancha?.descripcion || ''
        };
      });
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type.charAt(0).toUpperCase() + type.slice(1));
    XLSX.writeFile(wb, `reporte-${type}-epn.xlsx`);
  };

  return { handleDownloadPDF, exportToExcel };
} 