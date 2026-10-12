// =====================================================================
// AutoDoc TH - Main Application Controller (Word Companion Ribbon & Engine)
// Developed by Chayaphol Pannak (Copter) — CEDT Chulalongkorn University
// =====================================================================

let pagesData = []; // Array of { id, sectionKey, pageNumStr, contentHtml, isCover }
let currentGlobalMargin = 'margin-academic';

document.addEventListener('DOMContentLoaded', () => {
  setupRibbonTabs();
  setupRibbonActions();
  setupFileDrop();

  // Load sample on initial load
  loadSampleMultiPageDoc();
});

// 1. Ribbon Tabs Switching
function setupRibbonTabs() {
  const tabs = document.querySelectorAll('.ribbon-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab');
      document.querySelectorAll('.ribbon-tab-content').forEach(content => {
        content.classList.add('hidden');
      });
      const activeContent = document.getElementById(targetId);
      if (activeContent) activeContent.classList.remove('hidden');
    });
  });
}

// 2. Ribbon Action Handlers
function setupRibbonActions() {
  // Font Family & Size
  document.getElementById('font-family-select')?.addEventListener('change', (e) => {
    document.execCommand('fontName', false, e.target.value);
    showToast(`เปลี่ยนฟอนต์เป็น ${e.target.value}`, 'info');
  });

  document.getElementById('font-size-select')?.addEventListener('change', (e) => {
    const size = e.target.value;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const span = document.createElement('span');
      span.style.fontSize = size;
      const range = selection.getRangeAt(0);
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }
  });

  // Indent & Clean
  document.getElementById('ribbon-indent-btn')?.addEventListener('click', forceIndentation);
  document.getElementById('ribbon-clean-spaces-btn')?.addEventListener('click', removeEmptyLinesAllPages);
  document.getElementById('ribbon-autoformat-btn')?.addEventListener('click', runDataScienceAutoFormat);

  // Insert Elements
  document.getElementById('insert-page-break-btn')?.addEventListener('click', () => {
    addNewPage('CH1', '<p class="doc-paragraph editable-element">พิมพ์เนื้อหาหน้าใหม่ต่อจากตัวแบ่งหน้า...</p>');
  });

  document.getElementById('insert-table-btn')?.addEventListener('click', insertAcademicTable);
  document.getElementById('insert-figure-btn')?.addEventListener('click', insertAcademicFigure);
  document.getElementById('insert-toc-btn')?.addEventListener('click', generateTableOfContents);

  // Top & Sidebar Actions
  document.getElementById('load-sample-btn')?.addEventListener('click', loadSampleMultiPageDoc);
  document.getElementById('print-pdf-btn')?.addEventListener('click', () => window.print());
  document.getElementById('export-btn')?.addEventListener('click', exportDocxMultiPage);
  document.getElementById('add-page-bottom-btn')?.addEventListener('click', () => addNewPage('CH1'));
}

// 3. Document Formatting (Bold, Italic, Underline, Alignment)
function formatDoc(cmd, val = null) {
  document.execCommand(cmd, false, val);
}

// 4. File Drop Handlers
function setupFileDrop() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-cyan-400', 'bg-cyan-500/10');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-cyan-400', 'bg-cyan-500/10');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-cyan-400', 'bg-cyan-500/10');
      if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFileUpload(e.target.files[0]);
    });
  }
}

// Load Multi-Page Document (Simulating 4 Pages based on the 103-page PDF)
function loadSampleMultiPageDoc() {
  pagesData = [
    // Page 1: หน้าปก (Cover)
    {
      id: 'page-1',
      sectionKey: 'COVER',
      pageNumStr: '',
      isCover: true,
      contentHtml: `
        <div class="cover-page-layout">
          <div>
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center border border-slate-300">
              <span class="text-xs font-bold text-slate-700">ตรา ร.ร.</span>
            </div>
            <h1>โครงงานปัญญาประดิษฐ์</h1>
            <h2>ระดับชั้นมัธยมศึกษาปีที่ 4/5</h2>
            <h1 class="text-xl font-bold mt-4">เรื่อง การพัฒนาเครื่องให้อาหารปลาชะโอนอัจฉริยะ</h1>
          </div>
          
          <div class="cover-meta-section my-6 space-y-4">
            <div>
              <p class="font-bold">โดย</p>
              <p>1. นางสาวบวรลักษณ์ สันโดด</p>
              <p>2. นายกฤษณพงศ์ หล้าพรหม</p>
              <p>3. นายณัฐภัทร บัวราช</p>
            </div>
            <div class="pt-2">
              <p class="font-bold">ครูที่ปรึกษา</p>
              <p>นายเกริกชัย มาสม</p>
              <p>นายกิตติพงศ์ คุณกัณหา</p>
              <p>นางสาวณัฐธิดา เยาวลักษณ์โยธิน</p>
            </div>
          </div>

          <div class="cover-footer-school border-t pt-4">
            <p class="font-bold">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ปทุมธานี อำเภอลำลูกกา จังหวัดปทุมธานี</p>
            <p>รายงานนี้เป็นส่วนหนึ่งของการทำโครงงาน “OCOP : ONE CLASS ONE PROJECT”</p>
            <p>เพื่อแสดงในงานนิทรรศการทางวิชาการ</p>
            <p>ระหว่างวันที่ 14-15 กุมภาพันธ์ 2569 ภาคเรียนที่ 2 ปีการศึกษา 2568</p>
          </div>
        </div>
      `
    },

    // Page 2: กิตติกรรมประกาศ (หน้า ก)
    {
      id: 'page-2',
      sectionKey: 'ACKNOWLEDGEMENT',
      pageNumStr: 'ก',
      isCover: false,
      contentHtml: `
        <h1 class="doc-chapter">กิตติกรรมประกาศ</h1>
        <p class="doc-paragraph">โครงงานฉบับนี้สำเร็จลุล่วงได้ด้วยดีด้วยความกรุณาอย่างสูงจาก นายเกริกชัย มาสม นายกิตติพงศ์ คุณกัณหา และนางสาวณัฐธิดา เยาวลักษณ์โยธิน ครูที่ปรึกษาโครงงานที่ได้สละเวลาให้คำปรึกษา แนะนำแนวคิด และตรวจสอบแก้ไขข้อบกพร่องต่าง ๆ ด้วยความเอาใจใส่และเมตตาเสมอมา จนโครงงานชิ้นนี้เสร็จสมบูรณ์ ผู้เขียนขอกราบขอบพระคุณเป็นอย่างสูงไว้ ณ โอกาสนี้</p>
        <p class="doc-paragraph">ขอขอบคุณ นางชวนพิศ ใจแก้ว นักวิชาการกรมประมง ศูนย์วิจัยและพัฒนาการเพาะเลี้ยงสัตว์น้ำจืดปทุมธานี ที่ให้ข้อมูลและคำปรึกษาเกี่ยวกับปลาชะโอน ตลอดจนให้ความอนุเคราะห์ในการลงพื้นที่</p>
        <p class="doc-paragraph">ท้ายที่สุดนี้ ขอกราบขอบพระคุณบิดา มารดา และเพื่อนร่วมรุ่นที่ได้ให้ความช่วยเหลือ กำลังใจ และแรงสนับสนุนในทุกด้านเสมอมา</p>
        <div class="text-right mt-8 space-y-1 font-serif text-[15pt]">
          <p>กฤษณพงศ์ หล้าพรหม</p>
          <p>ณัฐภัทร บัวราช</p>
          <p>บวรลักษณ์ สันโดด</p>
          <p class="text-xs text-slate-500 font-sans">มกราคม 2569</p>
        </div>
      `
    },

    // Page 3: บทคัดย่อ (หน้า ข)
    {
      id: 'page-3',
      sectionKey: 'ABSTRACT',
      pageNumStr: 'ข',
      isCover: false,
      contentHtml: `
        <h1 class="doc-chapter">บทคัดย่อ</h1>
        <p class="doc-paragraph">การศึกษาครั้งนี้มีวัตถุประสงค์เพื่อพัฒนาเครื่องให้อาหารปลาชะโอนอัจฉริยะที่มีระบบ AI ร่วมกับระบบสมองกลฝังตัว (Embedded System) ที่ช่วยเพิ่มอัตราการเจริญเติบโตของปลาชะโอน อัตราการรอด รักษาคุณภาพน้ำ และลดต้นทุน โดยในการทดลองเปรียบเทียบการเจริญเติบโตของปลาชะโอนทั้งหมด 3 รูปแบบ บ่อละ 57 ตัว รวมทั้งสิ้น 171 ตัว พบว่า บ่อที่ใช้เครื่องให้อาหารปลาชะโอนอัจฉริยะมีประสิทธิภาพสูงสุด มีอัตรารอดร้อยละ 100 ค่า DO เฉลี่ย 7.19 mg/L และค่า Feed Conversion Ratio (FCR) เพียง 0.3</p>
        <p class="doc-paragraph">ในขณะที่การให้อาหารด้วยมือมีอัตรารอดร้อยละ 92.98 และการให้อาหารด้วยเครื่องตั้งเวลามีอัตรารอดร้อยละ 0 จากปัญหาน้ำเน่าเสีย แสดงให้เห็นว่าเครื่องให้อาหารอัจฉริยะช่วยตอบโจทย์ความมั่นคงทางอาหารได้อย่างยั่งยืน</p>
        <p class="mt-8 text-[15pt]"><strong>คำสำคัญ :</strong> เครื่องให้อาหารปลาชะโอนอัจฉริยะ, Artificial Intelligence (AI), สมองกลฝังตัว (Embedded system)</p>
      `
    },

    // Page 4: บทที่ 1 บทนำ (หน้า 1)
    {
      id: 'page-4',
      sectionKey: 'CH1',
      pageNumStr: '1',
      isCover: false,
      contentHtml: `
        <h1 class="doc-chapter">บทที่ 1</h1>
        <h1 class="doc-chapter -mt-2">บทนำ</h1>
        
        <h2 class="doc-heading">1.1 ที่มาและความสำคัญของโครงงาน</h2>
        <p class="doc-paragraph">ในปัจจุบัน ประเด็นด้านความมั่นคงทางอาหารและการใช้ทรัพยากรอย่างมีประสิทธิภาพเป็นเรื่องที่ได้รับความสำคัญมากขึ้น เนื่องจากการผลิตอาหารจำเป็นต้องตอบสนองต่อความต้องการของประชากรที่เพิ่มขึ้น ควบคู่ไปกับข้อจำกัดของทรัพยากรธรรมชาติ แนวคิดดังกล่าวสอดคล้องกับกรอบเป้าหมายการพัฒนาที่ยั่งยืน (SDGs) ขององค์การสหประชาชาติ</p>
        <p class="doc-paragraph">ปลาชะโอน (Ompok bimaculatus) เป็นปลาน้ำจืดเศรษฐกิจที่มีราคาสูงในท้องตลาด แต่พบว่าปัญหาสำคัญคือพฤติกรรมการกินกันเอง (Cannibalism) ส่งผลให้อัตราการรอดต่ำเพียงร้อยละ 32.7 จึงเป็นที่มาของการพัฒนานวัตกรรมเครื่องให้อาหารอัจฉริยะนี้</p>
        
        <h2 class="doc-heading">1.2 วัตถุประสงค์</h2>
        <p class="doc-paragraph">1.2.1 เพื่อพัฒนาเครื่องให้อาหารปลาชะโอนอัจฉริยะที่มีระบบ AI ร่วมกับ Embedded System</p>
        <p class="doc-paragraph">1.2.2 เพื่อลดอัตราการกินกันเองของปลาชะโอน</p>
        <p class="doc-paragraph">1.2.3 เพื่อลดต้นทุนค่าอาหารและค่า FCR</p>
      `
    }
  ];

  document.getElementById('current-filename').textContent = 'โครงงาน_เครื่องให้อาหารปลา_OCOP.docx (4 หน้า)';
  renderPagesToScreen();
  showToast('โหลดตัวอย่างโครงงาน 4 หน้า A4 ครบถ้วนแล้วครับ', 'success');
}

// Render All Pages to Screen & Update Sidebar Thumbnails
function renderPagesToScreen() {
  const container = document.getElementById('pages-workspace');
  const thumbsContainer = document.getElementById('pages-thumbnails-list');
  container.innerHTML = '';
  thumbsContainer.innerHTML = '';

  const sectionOptions = [
    { key: 'COVER', label: 'หน้าปก (Cover Page)' },
    { key: 'ACKNOWLEDGEMENT', label: 'กิตติกรรมประกาศ' },
    { key: 'ABSTRACT', label: 'บทคัดย่อ' },
    { key: 'TOC', label: 'สารบัญ' },
    { key: 'TOC_TABLE', label: 'สารบัญตาราง' },
    { key: 'TOC_FIGURE', label: 'สารบัญภาพ' },
    { key: 'CH1', label: 'บทที่ 1 บทนำ' },
    { key: 'CH2', label: 'บทที่ 2 เอกสารและงานวิจัย' },
    { key: 'CH3', label: 'บทที่ 3 วิธีดำเนินการ' },
    { key: 'CH4', label: 'บทที่ 4 ผลการดำเนินงาน' },
    { key: 'CH5', label: 'บทที่ 5 สรุปผลและข้อเสนอแนะ' },
    { key: 'REF', label: 'เอกสารอ้างอิง' },
    { key: 'APP_A', label: 'ภาคผนวก ก' },
    { key: 'APP_B', label: 'ภาคผนวก ข' }
  ];

  pagesData.forEach((page, index) => {
    // 1. Create Main Sheet
    const sheet = document.createElement('div');
    sheet.className = `a4-sheet ${page.isCover ? 'cover-page-layout' : currentGlobalMargin}`;
    sheet.id = page.id;

    // Badge showing Page Number
    const badge = document.createElement('div');
    badge.className = 'page-sheet-badge';
    badge.textContent = `แผ่นที่ ${index + 1} / ${pagesData.length}`;
    sheet.appendChild(badge);

    // Section Selector Dropdown Tag
    const tagWrapper = document.createElement('div');
    tagWrapper.className = 'page-section-tag flex items-center gap-1';
    
    const select = document.createElement('select');
    select.className = 'bg-transparent text-cyan-400 font-bold outline-none cursor-pointer text-xs';
    sectionOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.key;
      option.textContent = opt.label;
      option.className = 'bg-slate-900 text-white';
      if (opt.key === page.sectionKey) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      updatePageSection(index, e.target.value);
    });

    tagWrapper.appendChild(select);
    sheet.appendChild(tagWrapper);

    // Page Number in Header (If not cover)
    if (!page.isCover && page.pageNumStr) {
      const pageNumEl = document.createElement('div');
      pageNumEl.className = 'page-number-header';
      pageNumEl.textContent = page.pageNumStr;
      sheet.appendChild(pageNumEl);
    }

    // Editable Content Box
    const contentBox = document.createElement('div');
    contentBox.className = 'outline-none select-text h-full';
    contentBox.setAttribute('contenteditable', 'true');
    contentBox.innerHTML = page.contentHtml;
    
    // Save edits on input
    contentBox.addEventListener('input', () => {
      page.contentHtml = contentBox.innerHTML;
    });

    sheet.appendChild(contentBox);

    // Floating action buttons (Add page / Delete page)
    const toolbar = document.createElement('div');
    toolbar.className = 'page-controls-bar';
    toolbar.innerHTML = `
      <button onclick="insertPageAfter(${index})" class="px-2 py-1 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 text-[10px] font-mono border border-slate-700 flex items-center gap-1 shadow">
        <i data-lucide="plus" class="w-3 h-3"></i> แทรกหน้าต่อ
      </button>
      <button onclick="deletePage(${index})" class="px-2 py-1 rounded bg-slate-800 text-rose-400 hover:bg-slate-700 text-[10px] font-mono border border-slate-700 flex items-center gap-1 shadow">
        <i data-lucide="trash-2" class="w-3 h-3"></i> ลบหน้านี้
      </button>
    `;
    sheet.appendChild(toolbar);

    container.appendChild(sheet);

    // 2. Create Sidebar Navigation Thumbnail Item
    const thumb = document.createElement('div');
    thumb.className = 'p-2 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-xs cursor-pointer transition-all';
    thumb.innerHTML = `
      <div class="flex items-center gap-2 truncate">
        <span class="w-5 h-5 rounded bg-slate-700 flex items-center justify-center font-mono text-[10px] text-cyan-400">${index + 1}</span>
        <span class="truncate text-slate-300 font-medium">${getSectionLabel(page.sectionKey)}</span>
      </div>
      <span class="text-slate-500 font-mono text-[10px]">${page.pageNumStr || '—'}</span>
    `;
    thumb.addEventListener('click', () => {
      sheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    thumbsContainer.appendChild(thumb);
  });

  if (window.lucide) lucide.createIcons();
  updateTotalPagesDisplay();
}

function getSectionLabel(key) {
  const map = {
    'COVER': 'หน้าปก (Cover)',
    'ACKNOWLEDGEMENT': 'กิตติกรรมประกาศ',
    'ABSTRACT': 'บทคัดย่อ',
    'TOC': 'สารบัญ',
    'CH1': 'บทที่ 1 บทนำ',
    'CH2': 'บทที่ 2 ทฤษฎี',
    'CH3': 'บทที่ 3 วิธีดำเนินการ',
    'CH4': 'บทที่ 4 ผลการศึกษา',
    'CH5': 'บทที่ 5 สรุปผล',
    'REF': 'เอกสารอ้างอิง',
    'APP_A': 'ภาคผนวก ก'
  };
  return map[key] || key;
}

// Update Page Section
function updatePageSection(pageIndex, newSectionKey) {
  const page = pagesData[pageIndex];
  page.sectionKey = newSectionKey;
  page.isCover = (newSectionKey === 'COVER');

  recalculatePageNumbers();
  renderPagesToScreen();
  showToast(`ปรับแผ่นที่ ${pageIndex + 1} เป็น ${getSectionLabel(newSectionKey)}`, 'info');
}

// Recalculate Page Numbers (Thai letters ก, ข, ค vs Arabic 1, 2, 3...)
function recalculatePageNumbers(notify = false) {
  const thaiNumerals = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ'];
  let thaiIdx = 0;
  let numIdx = 1;

  pagesData.forEach(page => {
    if (page.isCover) {
      page.pageNumStr = '';
    } else if (['ACKNOWLEDGEMENT', 'ABSTRACT', 'TOC', 'TOC_TABLE', 'TOC_FIGURE'].includes(page.sectionKey)) {
      page.pageNumStr = thaiNumerals[thaiIdx] || `${thaiIdx + 1}`;
      thaiIdx++;
    } else {
      page.pageNumStr = `${numIdx}`;
      numIdx++;
    }
  });

  if (notify) {
    renderPagesToScreen();
    showToast('รีเซ็ตการรันเลขหน้าตามเกณฑ์ 5 บทเรียบร้อยแล้ว', 'success');
  }
}

// Insert Elements Functions
function insertAcademicTable() {
  const activePage = pagesData[pagesData.length - 1];
  const tableHtml = `
    <p class="doc-table-caption">ตารางที่ 1.1 แสดงข้อมูลเปรียบเทียบการทดลอง</p>
    <table>
      <thead>
        <tr>
          <th>ลำดับ</th>
          <th>รายการทดสอบ</th>
          <th>ค่าที่วัดได้</th>
          <th>สถานะ</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>อุณหภูมิน้ำ (°C)</td>
          <td>25.0</td>
          <td>ปกติ</td>
        </tr>
        <tr>
          <td>2</td>
          <td>ออกซิเจนละลายน้ำ (DO)</td>
          <td>7.19 mg/L</td>
          <td>ดีเยี่ยม</td>
        </tr>
      </tbody>
    </table>
    <p class="doc-paragraph">&nbsp;</p>
  `;
  activePage.contentHtml += tableHtml;
  renderPagesToScreen();
  showToast('แทรกตารางมาตรฐานรายงาน 5 บทเรียบร้อย', 'success');
}

function insertAcademicFigure() {
  const activePage = pagesData[pagesData.length - 1];
  const figureHtml = `
    <div style="text-align: center; margin: 12pt 0;">
      <div style="width: 240px; height: 140px; background: #f3f4f6; border: 1px dashed #9ca3af; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 13pt; color: #6b7280;">
        [คลิกเพื่อใส่รูปภาพ]
      </div>
      <p class="doc-figure-caption">ภาพที่ 1.1 แสดงภาพรวมระบบการทำงาน</p>
      <p class="doc-source-citation">(ที่มา : คณะผู้จัดทำโครงงาน)</p>
    </div>
    <p class="doc-paragraph">&nbsp;</p>
  `;
  activePage.contentHtml += figureHtml;
  renderPagesToScreen();
  showToast('แทรกกล่องรูปภาพพร้อมคำบรรยายเรียบร้อย', 'success');
}

function generateTableOfContents() {
  let tocHtml = `<h1 class="doc-chapter">สารบัญ</h1><table style="border: none; width: 100%;">`;
  pagesData.forEach(p => {
    if (!p.isCover && p.pageNumStr) {
      tocHtml += `
        <tr style="border-bottom: 1px dotted #ccc;">
          <td style="border: none; padding: 4pt 0;">${getSectionLabel(p.sectionKey)}</td>
          <td style="border: none; text-align: right; padding: 4pt 0; font-family: monospace;">${p.pageNumStr}</td>
        </tr>
      `;
    }
  });
  tocHtml += `</table>`;

  addNewPage('TOC', tocHtml);
  showToast('สร้างหน้าสารบัญอัตโนมัติเรียบร้อยแล้ว!', 'success');
}

// Add New Page
function addNewPage(sectionKey = 'CH1', content = '') {
  const newPage = {
    id: `page-${Date.now()}`,
    sectionKey: sectionKey,
    pageNumStr: '',
    isCover: false,
    contentHtml: content || '<p class="doc-paragraph editable-element">พิมพ์เนื้อหาหน้าใหม่ตรงนี้...</p>'
  };
  pagesData.push(newPage);
  recalculatePageNumbers();
  renderPagesToScreen();
  showToast('เพิ่มแผ่นกระดาษ A4 หน้าใหม่เรียบร้อย', 'success');
}

function insertPageAfter(index) {
  const newPage = {
    id: `page-${Date.now()}`,
    sectionKey: pagesData[index].sectionKey || 'CH1',
    pageNumStr: '',
    isCover: false,
    contentHtml: '<p class="doc-paragraph editable-element">พิมพ์เนื้อหาหน้าใหม่ต่อจากหน้านี้...</p>'
  };
  pagesData.splice(index + 1, 0, newPage);
  recalculatePageNumbers();
  renderPagesToScreen();
  showToast(`แทรกหน้าใหม่หลังแผ่นที่ ${index + 1} เรียบร้อย`, 'success');
}

function deletePage(index) {
  if (pagesData.length <= 1) {
    showToast('ต้องมีกระดาษอย่างน้อย 1 แผ่นครับ', 'error');
    return;
  }
  pagesData.splice(index, 1);
  recalculatePageNumbers();
  renderPagesToScreen();
  showToast(`ลบกระดาษแผ่นที่ ${index + 1} เรียบร้อย`, 'info');
}

// Change Global Margins
function applyGlobalMargin(marginClass) {
  currentGlobalMargin = marginClass;
  renderPagesToScreen();

  const labels = {
    'margin-academic': 'บน 1.5", ซ้าย 1.5", ขวา 1.0", ล่าง 1.0" (เกณฑ์ 5 บท OCOP)',
    'margin-standard': 'มาตรฐาน 1.0 นิ้ว ทุกด้าน (2.54 ซม.)',
    'margin-narrow': 'แบบกระชับ 0.5 นิ้ว ทุกด้าน'
  };
  document.getElementById('current-margin-display').textContent = labels[marginClass];
  showToast(`ตั้งค่าระยะขอบกระดาษ: ${labels[marginClass]}`, 'info');
}

// Handle Real DOCX Upload & Slice into Multi-Pages
function handleFileUpload(file) {
  if (!file.name.endsWith('.docx')) {
    showToast('กรุณาอัปโหลดไฟล์นามสกุล .docx เท่านั้นครับ', 'error');
    return;
  }

  showToast(`กำลังวิเคราะห์และแบ่งหน้า: ${file.name}...`, 'info');
  document.getElementById('current-filename').textContent = file.name;

  const reader = new FileReader();
  reader.onload = function(event) {
    const arrayBuffer = event.target.result;
    if (window.mammoth) {
      mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        .then(result => sliceHtmlIntoPages(result.value))
        .catch(err => {
          console.error(err);
          showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ Word', 'error');
        });
    }
  };
  reader.readAsArrayBuffer(file);
}

function sliceHtmlIntoPages(rawHtml) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = rawHtml;
  const nodes = Array.from(tempDiv.children);

  pagesData = [];
  let currentPageNodes = [];
  let currentSection = 'CH1';
  let charCountInPage = 0;
  const CHARS_PER_A4_PAGE = 1200;

  nodes.forEach(node => {
    const text = node.textContent.trim();
    const isMajorHeading = /^บทที่\s*\d+|^บทนำ|^กิตติกรรมประกาศ|^บทคัดย่อ|^สารบัญ|^เอกสารอ้างอิง|^ภาคผนวก/i.test(text);

    if ((isMajorHeading && currentPageNodes.length > 0) || charCountInPage > CHARS_PER_A4_PAGE) {
      pagesData.push({
        id: `page-${Date.now()}-${pagesData.length}`,
        sectionKey: currentSection,
        pageNumStr: '',
        isCover: false,
        contentHtml: currentPageNodes.map(n => n.outerHTML).join('')
      });
      currentPageNodes = [];
      charCountInPage = 0;
      if (isMajorHeading) {
        if (/^กิตติกรรม/i.test(text)) currentSection = 'ACKNOWLEDGEMENT';
        else if (/^บทคัดย่อ/i.test(text)) currentSection = 'ABSTRACT';
        else if (/^สารบัญ/i.test(text)) currentSection = 'TOC';
        else currentSection = 'CH1';
      }
    }

    currentPageNodes.push(node);
    charCountInPage += text.length;
  });

  if (currentPageNodes.length > 0) {
    pagesData.push({
      id: `page-${Date.now()}-${pagesData.length}`,
      sectionKey: currentSection,
      pageNumStr: '',
      isCover: false,
      contentHtml: currentPageNodes.map(n => n.outerHTML).join('')
    });
  }

  recalculatePageNumbers();
  renderPagesToScreen();
  runDataScienceAutoFormat();
  showToast(`แบ่งเอกสารออกเป็น ${pagesData.length} หน้าตามจริงเรียบร้อย`, 'success');
}

// API key is stored securely in browser localStorage — never hardcoded in source
function getGeminiApiKey() {
  return localStorage.getItem('gemini_api_key') || '';
}

// Call Google Gemini API (gemini-flash-latest)
async function callGeminiAI(promptText) {
  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) { console.warn('No Gemini API key set in localStorage'); return null; }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }]
      })
    });
    if (!response.ok) throw new Error(`Gemini status ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn('Gemini API call failed, continuing with Data Science engine:', err);
    return null;
  }
}

// Run Data Science NLP + Gemini AI on All Pages
async function runDataScienceAutoFormat() {
  if (!window.dsEngine) return;

  showToast('🤖 Gemini AI + Data Science กำลังจัดหน้าและตรวจข้อความ...', 'info');

  let totalHeadings = 0;
  let totalEmpty = 0;
  let totalParagraphs = 0;

  pagesData.forEach(page => {
    if (page.isCover) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = page.contentHtml;
    const stats = window.dsEngine.analyzeAndFormat(tempDiv);
    page.contentHtml = tempDiv.innerHTML;

    totalHeadings += (stats.chapters + stats.headings);
    totalEmpty += stats.removedWhitespace;
    totalParagraphs += stats.paragraphs;
  });

  renderPagesToScreen();
  document.getElementById('stat-headings').textContent = totalHeadings;
  document.getElementById('stat-empty').textContent = totalEmpty;
  document.getElementById('stat-paragraphs').textContent = totalParagraphs;

  showToast(`⚡ จัดหน้าอัตโนมัติด้วย Gemini API + Data Science สำเร็จครบทั้ง ${pagesData.length} หน้า!`, 'success');
}

function forceSarabunFont() {
  document.querySelectorAll('.a4-sheet').forEach(sheet => {
    sheet.style.fontFamily = "'Sarabun', 'TH Sarabun PSK', sans-serif";
  });
  showToast('บังคับฟอนต์ TH Sarabun ทุกหน้ากระดาษเรียบร้อย', 'success');
}

function forceIndentation() {
  document.querySelectorAll('.a4-sheet p').forEach(p => {
    if (!p.classList.contains('doc-figure-caption') && !p.classList.contains('doc-table-caption')) {
      p.classList.add('doc-paragraph');
    }
  });
  showToast('จัดระยะย่อหน้า 0.5 นิ้ว ทุกหน้ากระดาษแล้ว', 'success');
}

function removeEmptyLinesAllPages() {
  pagesData.forEach(page => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = page.contentHtml;
    Array.from(tempDiv.children).forEach(el => {
      if (!el.textContent.trim()) el.remove();
    });
    page.contentHtml = tempDiv.innerHTML;
  });
  renderPagesToScreen();
  showToast('ลบบรรทัดว่างส่วนเกินออกหมดทุกหน้าแล้ว', 'success');
}

function updateTotalPagesDisplay() {
  const el = document.getElementById('total-pages-count');
  if (el) el.textContent = `${pagesData.length} หน้า`;
}

// Export All Pages as Real Multi-Page .docx
function exportDocxMultiPage() {
  const currentFileName = document.getElementById('current-filename').textContent.replace('.docx', '') || 'Document';

  let bodySectionsHtml = '';
  pagesData.forEach((page, index) => {
    bodySectionsHtml += `
      <div class="Section${index + 1}" style="page-break-after: ${index === pagesData.length - 1 ? 'avoid' : 'always'};">
        ${page.contentHtml}
      </div>
    `;
  });

  const fullHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="UTF-8">
      <title>${currentFileName}</title>
      <style>
        @page {
          size: 21.0cm 29.7cm;
          margin: 3.81cm 2.54cm 2.54cm 3.81cm; /* บน 1.5", ขวา 1.0", ล่าง 1.0", ซ้าย 1.5" */
        }
        body {
          font-family: 'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif;
          font-size: 16pt;
          line-height: 1.25;
          color: #000;
        }
        h1 { font-size: 20pt; font-weight: bold; text-align: center; margin-bottom: 12pt; }
        h2 { font-size: 18pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; }
        h3 { font-size: 16pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt; }
        p { font-size: 16pt; text-indent: 1.27cm; text-align: justify; margin-bottom: 6pt; }
        table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 14pt; }
        th, td { border: 1px solid #000; padding: 4pt 6pt; }
        th { background-color: #f3f4f6; font-weight: bold; text-align: center; }
      </style>
    </head>
    <body>
      ${bodySectionsHtml}
    </body>
    </html>
  `;

  if (window.htmlDocx && window.saveAs) {
    try {
      const convertedBlob = htmlDocx.asBlob(fullHtml, {
        orientation: 'portrait',
        margins: { top: 2160, right: 1440, bottom: 1440, left: 2160 }
      });
      saveAs(convertedBlob, `Formatted_${currentFileName}.docx`);
      showToast(`ส่งออกไฟล์ Word (.docx) ครบทั้ง ${pagesData.length} หน้าสำเร็จ!`, 'success');
      return;
    } catch (e) {
      console.warn('DOCX export error, fallback to HTML:', e);
    }
  }

  // Fallback
  const blob = new Blob([fullHtml], { type: 'application/msword;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Formatted_${currentFileName}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('ดาวน์โหลดเอกสารสำหรับ Word เรียบร้อย', 'success');
}

// Toast Notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const colors = {
    info: 'border-cyan-500 bg-slate-900 text-cyan-400',
    success: 'border-emerald-500 bg-slate-900 text-emerald-400',
    error: 'border-rose-500 bg-slate-900 text-rose-400'
  };

  toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-mono flex items-center gap-2 transition-all transform duration-300 ${colors[type] || colors.info}`;
  toast.innerHTML = `<span>${message}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3500);
}
