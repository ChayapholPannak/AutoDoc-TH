// =====================================================================
// AutoDoc Data Science Engine: Document Structural NLP & Heuristics
// Crafted by Chayaphol Pannak (Copter) for CEDT Chulalongkorn University
// =====================================================================

class DocumentDataScienceEngine {
  constructor() {
    this.patterns = {
      chapter: /^(บทที่\s*\d+|บทนำ|เอกสารและงานวิจัยที่เกี่ยวข้อง|วิธีดำเนินการ|ผลการดำเนินงาน|สรุป\s*อภิปรายผล|เอกสารอ้างอิง|ภาคผนวก\s*[ก-ฮA-Z]?\.?)/i,
      headingL1: /^\d+\.\d+\s+/,
      headingL2: /^\d+\.\d+\.\d+\s+/,
      headingL3: /^\d+\.\d+\.\d+\.\d+\s+/,
      tableCaption: /^(ตารางที่\s*\d+\.\d+)/i,
      figureCaption: /^(ภาพที่\s*\d+\.\d+|รูปที่\s*\d+\.\d+)/i,
      sourceCitation: /^\(ที่มา\s*:/i,
      preliminaryHeadings: /^(กิตติกรรมประกาศ|บทคัดย่อ|สารบัญ|สารบัญตาราง|สารบัญภาพ)/
    };
  }

  classifyBlock(text) {
    const cleanText = text.trim();
    if (!cleanText) return { type: 'EMPTY' };

    if (this.patterns.chapter.test(cleanText) || this.patterns.preliminaryHeadings.test(cleanText)) {
      return { type: 'CHAPTER_TITLE' };
    }
    if (this.patterns.headingL1.test(cleanText)) return { type: 'HEADING_L1' };
    if (this.patterns.headingL2.test(cleanText)) return { type: 'HEADING_L2' };
    if (this.patterns.headingL3.test(cleanText)) return { type: 'HEADING_L3' };
    if (this.patterns.tableCaption.test(cleanText)) return { type: 'TABLE_CAPTION' };
    if (this.patterns.figureCaption.test(cleanText)) return { type: 'FIGURE_CAPTION' };
    if (this.patterns.sourceCitation.test(cleanText)) return { type: 'SOURCE_CITATION' };

    return { type: 'BODY_PARAGRAPH' };
  }

  analyzeAndFormat(containerElement) {
    const rawNodes = Array.from(containerElement.children);
    const stats = {
      chapters: 0,
      headings: 0,
      paragraphs: 0,
      tables: 0,
      figures: 0,
      removedWhitespace: 0
    };

    const fragment = document.createDocumentFragment();

    rawNodes.forEach(node => {
      const rawText = node.textContent.trim();
      const analysis = this.classifyBlock(rawText);

      if (analysis.type === 'EMPTY') {
        stats.removedWhitespace++;
        return;
      }

      let newEl;
      switch (analysis.type) {
        case 'CHAPTER_TITLE':
          newEl = document.createElement('h1');
          newEl.className = 'doc-chapter editable-element';
          newEl.textContent = rawText;
          stats.chapters++;
          break;

        case 'HEADING_L1':
          newEl = document.createElement('h2');
          newEl.className = 'doc-heading editable-element';
          newEl.textContent = rawText;
          stats.headings++;
          break;

        case 'HEADING_L2':
          newEl = document.createElement('h3');
          newEl.className = 'doc-subheading editable-element';
          newEl.textContent = rawText;
          stats.headings++;
          break;

        case 'TABLE_CAPTION':
          newEl = document.createElement('p');
          newEl.className = 'doc-table-caption font-bold text-[16pt] text-left mb-1';
          newEl.textContent = rawText;
          stats.tables++;
          break;

        case 'FIGURE_CAPTION':
          newEl = document.createElement('p');
          newEl.className = 'doc-figure-caption font-bold text-[16pt] text-center mt-2 mb-0.5';
          newEl.textContent = rawText;
          stats.figures++;
          break;

        case 'SOURCE_CITATION':
          newEl = document.createElement('p');
          newEl.className = 'doc-source-citation text-[14pt] text-center text-slate-600 mb-3';
          newEl.textContent = rawText;
          break;

        default:
          newEl = document.createElement('p');
          newEl.className = 'doc-paragraph editable-element';
          newEl.textContent = rawText;
          stats.paragraphs++;
          break;
      }

      fragment.appendChild(newEl);
    });

    containerElement.innerHTML = '';
    containerElement.appendChild(fragment);

    return stats;
  }
}

window.dsEngine = new DocumentDataScienceEngine();
