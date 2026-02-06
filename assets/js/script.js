const sizes = { 'a4': { w: '210mm', h: '297mm' }, 'letter': { w: '215.9mm', h: '279.4mm' }, 'legal': { w: '215.9mm', h: '355.6mm' } };

function changePageSize(val) {
    const page = document.getElementById('page-render');
    page.style.width = sizes[val].w;
    page.style.minHeight = sizes[val].h;
}

const fieldConfigs = [
    { id: 'sem', label: 'Semester', prefix: 'Semester: ', sz: 18, align: 'center', pos: 'top' },
    { id: 'code', label: 'Course Code', prefix: 'Course Code: ', sz: 18, align: 'center', pos: 'top' },
    { id: 'course', label: 'Course Name', prefix: 'Course Name: ', sz: 19, align: 'center', pos: 'top' },
    { id: 'sec', label: 'Section', prefix: 'Section: ', sz: 17, align: 'center', pos: 'top' },
    { id: 'grp', label: 'Group', prefix: 'Group: ', sz: 17, align: 'center', pos: 'top' },
    { id: 'top', label: 'Topic Name', prefix: '', sz: 16, align: 'center', pos: 'bottom' },
    { id: 'teach', label: 'Supervised By', prefix: '', sz: 16, align: 'left', pos: 'bottom' },
    { id: 'me', label: 'Submitted By', prefix: '', sz: 16, align: 'left', pos: 'bottom' },
    { id: 'date', label: 'Submission Date', prefix: '', sz: 15, type: 'date', align: 'left', pos: 'bottom' }
];

fieldConfigs.forEach(f => {
    const container = document.getElementById(f.pos === 'top' ? 'top-fields' : 'bottom-fields');
    const div = document.createElement('div');
    div.className = 'input-card';
    div.innerHTML = `<label>${f.label}</label><input type="${f.type || 'text'}" class="text-input" id="in-${f.id}" oninput="updateView('${f.id}')"><div class="style-tools"><select id="font-${f.id}" onchange="updateView('${f.id}')"><option value="Arial">Arial</option><option value="'Times New Roman'">TNR</option></select>Size: <input type="number" id="sz-${f.id}" value="${f.sz}" oninput="updateView('${f.id}')"><button class="btn-tool active" id="b-${f.id}" onclick="toggleS('${f.id}','b')">B</button><button class="btn-tool ${f.align==='center'?'active':''}" id="al-${f.id}-center" onclick="setAlign('${f.id}','center')">C</button></div>`;
    container.appendChild(div);
});

function resizeLogo(val) { document.getElementById('viewLogo').style.width = val + 'px'; document.getElementById('sizeVal').innerText = val + 'px'; }

function setAlign(id, align) {
    const target = document.getElementById(`out-${id}`);
    if(target) target.style.textAlign = align;
    document.querySelectorAll(`[id^="al-${id}-"]`).forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(`al-${id}-${align}`);
    if(btn) btn.classList.add('active');
}

function toggleS(id, type) { document.getElementById(`${type}-${id}`).classList.toggle('active'); updateView(id); }

function updateView(id) {
    const config = fieldConfigs.find(c => c.id === id) || { prefix: '' };
    const val = (id === 'uni') ? document.getElementById('in-uni').value : document.getElementById(`in-${id}`).value;
    const target = document.getElementById(`out-${id}`);
    if (val.trim() !== "") {
        target.classList.add('visible');
        if(id === 'sem') document.getElementById('spacer-sem').style.display = 'block';
        if(['teach', 'me'].includes(id)) document.getElementById('out-sub-info').classList.add('visible');
        if(id === 'date') document.getElementById('out-date-box').classList.add('visible');
        target.innerHTML = (id === 'uni' || config.prefix === '' ? val : config.prefix + val);
        target.style.fontSize = document.getElementById(`sz-${id}`).value + "px";
        target.style.fontWeight = document.getElementById(`b-${id}`).classList.contains('active') ? "bold" : "normal";
        target.style.fontFamily = document.getElementById(`font-${id}`)?.value || 'Arial';
    } else target.classList.remove('visible');
}

function updateLabelType() {
    const val = document.getElementById('in-label-type').value;
    const target = document.getElementById('out-label-box');
    if(val !== "") { target.innerHTML = val; target.classList.add('visible'); } else target.classList.remove('visible');
}

function addMember() {
    const id = Date.now();
    const div = document.createElement('div');
    div.className = 'member-entry';
        div.id = `row-${id}`;
        div.classList.add('member-entry');
        div.innerHTML = `<input type="text" placeholder="Name" class="text-input" oninput="updateMembers()"><input type="text" placeholder="ID" class="text-input" oninput="updateMembers()"><button class="btn-remove" onclick="this.parentElement.remove(); updateMembers();">×</button>`;
    document.getElementById('member-inputs').appendChild(div);
}

function updateMembers() {
    const entries = document.querySelectorAll('.member-entry');
    const tbody = document.getElementById('member-body');
    const table = document.getElementById('table-render');
    tbody.innerHTML = '';
    let hasData = false;
    entries.forEach(entry => {
        const ins = entry.querySelectorAll('input');
        if (ins[0].value || ins[1].value) { hasData = true; tbody.innerHTML += `<tr><td>${ins[0].value}</td><td>${ins[1].value}</td></tr>`; }
    });
    table.classList.toggle('visible', hasData);
}

document.getElementById('logoIn').onchange = (e) => {
    const r = new FileReader();
    r.onload = res => { document.getElementById('viewLogo').src = res.target.result; document.getElementById('out-logo-box').classList.add('visible'); };
    r.readAsDataURL(e.target.files[0]);
};

function downloadPDF() {
    const element = document.getElementById('page-render');
    html2pdf().from(element).set({ margin: 0, filename: 'Cover_Page.pdf', html2canvas: { scale: 3, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).toPdf().get('pdf').then(pdf => {
        for (let i = pdf.internal.getNumberOfPages(); i > 1; i--) { pdf.deletePage(i); }
    }).save();
}