/**
 * Export utilities for PDF and Image generation
 */

export interface ExportOptions {
  elementId: string;
  filename: string;
  type: 'pdf';
}

export const exportReport = async (options: ExportOptions): Promise<{ success: boolean; error?: string }> => {
  const { elementId, filename, type } = options;
  const element = document.getElementById(elementId);

  if (!element) {
    return {
      success: false,
      error: "Elemento do relatório não encontrado."
    };
  }

  // Check if required libraries are available
  if (typeof window === 'undefined') {
    return {
      success: false,
      error: "Ambiente do navegador não disponível."
    };
  }

  const hasHtml2Pdf = !!(window as any).html2pdf;

  if (type === 'pdf' && !hasHtml2Pdf) {
    return {
      success: false,
      error: "Biblioteca de PDF não carregada. Recarregue a página e tente novamente."
    };
  }

  try {
    const { withTimeout } = await import('./api');

    if (type === 'pdf') {
      // Responsive PDF export: Capture exactly what is seen
      // We calculate the scale based on the element's width to fit A4 width if possible, 
      // but "mirror exact layout" means we prioritize the visual layout over fixed A4 sizing.

      const elementWidth = element.scrollWidth;
      const elementHeight = element.scrollHeight;

      const opt = {
        margin: [5, 5, 5, 5], // 5mm margin
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2, // Retain high quality
          useCORS: true,
          // REMOVED windowWidth force. 
          // Default html2canvas behavior captures the element as rendered.
          scrollY: 0,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: elementWidth > elementHeight ? 'landscape' : 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // @ts-ignore
      await withTimeout(
        (window as any).html2pdf().set(opt).from(element).save(),
        120000 // 120 seconds for PDF
      );

      return { success: true };
    }

    return { success: false, error: "Tipo de exportação não suportado." };

  } catch (error: any) {
    console.error(`Erro ao exportar ${type}:`, error);

    if (error.message?.includes('timeout')) {
      return {
        success: false,
        error: "Tempo de espera esgotado ao gerar PDF. O relatório pode ser muito grande."
      };
    }

    return {
      success: false,
      error: `Erro ao gerar PDF. Verifique se todas as imagens estão carregadas e tente novamente.`
    };
  }
};




