// =====================================================================
// AutoDoc Data Science Engine v2.0 — Document Structural NLP & Heuristics
// Crafted by Chayaphol Pannak (Copter) for CEDT Chulalongkorn University
// =====================================================================

class DocumentDataScienceEngine {
  constructor() {
    // -------- Pattern Definitions --------
    this.patterns = {
      // บทที่ X หรือชื่อบทตามมาตรฐาน OCOP
      chapter: /^(บทที่\s*\d+|บทนำ|เอกสารและงานวิจัยที่เกี่ยวข้อง|วิธีดำเนินการ|ผลการดำเนินงาน|สรุป\s*(?:ผล)?(?:และข้อเสนอแนะ)?|เอกสารอ้างอิง|ภาคผนวก\s*[ก-ฮA-Z]?\.?)/i,
      // หัวข้อในบท เช่น 1.1, 2.3
      headingL1: /^\d+\.\d+\s+.+/,
      // หัวข้อย่อย เช่น 1.1.1
      headingL2: /^\d+\.\d+\.\d+\s+.+/,
      // หัวข้อย่อยลึก เช่น 1.1.1.1
      headingL3: /^\d+\.\d+\.\d+\.\d+\s+.+/,
      // คำบรรยายตาราง
      tableCaption: /^(ตารางที่\s*\d+[\.\d]*)/i,
      // คำบรรยายภาพ
      figureCaption: /^(ภาพที่\s*\d+[\.\d]*|รูปที่\s*\d+[\.\d]*|แผนภาพที่\s*\d+[\.\d]*)/i,
      // อ้างอิงที่มา
      sourceCitation: /^\(ที่มา\s*:/i,
      // หน้าพิเศษก่อนเนื้อหา
      preliminaryHeadings: /^(กิตติกรรมประกาศ|บทคัดย่อ|สารบัญ(?:ตาราง|ภาพ)?|Abstract)/i,
      // ข้อ bullet เลข
      listItem: /^(\d+\.|[ก-ฮ]\.|[-•]\s)/,
    };
  }

  // -------- Classify a single block of text --------
  classifyBlock(text) {
    const cleanText = text.trim();
    if (!cleanText || cleanText === '\u00a0' || cleanText === '&nbsp;') return { type: 'EMPTY' };

    // ต้องเช็ค headingL3 > L2 > L1 ก่อน chapter (เพราะ regex อาจซ้อนกัน)
    if (this.patterns.headingL3.test(cleanText)) return { type: 'HEADING_L3' };
    if (this.patterns.headingL2.test(cleanText)) return { type: 'HEADING_L2' };
    if (this.patterns.headingL1.test(cleanText)) return { type: 'HEADING_L1' };

    if (this.patterns.chapter.test(cleanText) || this.patterns.preliminaryHeadings.test(cleanText)) {
      return { type: 'CHAPTER_TITLE' };
    }

    if (this.patterns.tableCaption.test(cleanText)) return { type: 'TABLE_CAPTION' };
    if (this.patterns.figureCaption.test(cleanText)) return { type: 'FIGURE_CAPTION' };
    if (this.patterns.sourceCitation.test(cleanText)) return { type: 'SOURCE_CITATION' };
    if (this.patterns.listItem.test(cleanText)) return { type: 'LIST_ITEM' };

    return { type: 'BODY_PARAGRAPH' };
  }

  // -------- Detect section key from heading text --------
  detectSectionKey(text) {
    const t = text.trim();
    if (/^กิตติกรรม/i.test(t)) return 'ACKNOWLEDGEMENT';
    if (/^บทคัดย่อ/i.test(t)) return 'ABSTRACT';
    if (/^สารบัญตาราง/i.test(t)) return 'TOC_TABLE';
    if (/^สารบัญภาพ/i.test(t)) return 'TOC_FIGURE';
    if (/^สารบัญ/i.test(t)) return 'TOC';
    if (/^เอกสารอ้างอิง/i.test(t)) return 'REF';
    if (/ภาคผนวก\s*ข/i.test(t)) return 'APP_B';
    if (/ภาคผนวก/i.test(t)) return 'APP_A';
    // ตรวจจับบทที่ 1-5
    const chapterMatch = t.match(/^บทที่\s*(\d+)/i);
    if (chapterMatch) return `CH${chapterMatch[1]}`;
    // ชื่อบทโดยตรง
    if (/^บทนำ/i.test(t)) return 'CH1';
    if (/^เอกสารและงานวิจัย/i.test(t)) return 'CH2';
    if (/^วิธีดำเนินการ/i.test(t)) return 'CH3';
    if (/^ผลการดำเนินงาน/i.test(t)) return 'CH4';
    if (/^สรุป/i.test(t)) return 'CH5';
    return null;
  }

  // -------- Analyze & Format (preserve existing HTML, only add/fix classes) --------
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

    rawNodes.forEach(node => {
      const tagName = node.tagName.toLowerCase();

      // Skip tables, images, divs — don't reformat structural HTML
      if (['table', 'figure', 'img', 'div'].includes(tagName)) {
        stats.tables++;
        return;
      }

      const rawText = node.textContent.trim();
      const analysis = this.classifyBlock(rawText);

      // Remove empty nodes
      if (analysis.type === 'EMPTY') {
        node.remove();
        stats.removedWhitespace++;
        return;
      }

      // Apply classes based on type — don't touch innerHTML (preserve formatting)
      switch (analysis.type) {
        case 'CHAPTER_TITLE':
          node.className = 'doc-chapter';
          stats.chapters++;
          break;

        case 'HEADING_L1':
          node.className = 'doc-heading';
          stats.headings++;
          break;

        case 'HEADING_L2':
          node.className = 'doc-subheading';
          stats.headings++;
          break;

        case 'HEADING_L3':
          node.className = 'doc-subsubheading';
          stats.headings++;
          break;

        case 'TABLE_CAPTION':
          node.className = 'doc-table-caption';
          stats.tables++;
          break;

        case 'FIGURE_CAPTION':
          node.className = 'doc-figure-caption';
          stats.figures++;
          break;

        case 'SOURCE_CITATION':
          node.className = 'doc-source-citation';
          break;

        case 'LIST_ITEM':
          node.className = 'doc-list-item';
          stats.paragraphs++;
          break;

        default: // BODY_PARAGRAPH
          // Only add doc-paragraph if no other doc-* class already set
          if (!node.className || node.className === 'editable-element') {
            node.className = 'doc-paragraph';
          }
          stats.paragraphs++;
          break;
      }
    });

    return stats;
  }
}

window.dsEngine = new DocumentDataScienceEngine();
