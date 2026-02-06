/* =========================
   Page Sizes
========================= */
const sizes = {
    a4: {
        w: '210mm',
        h: '297mm'
    },
    letter: {
        w: '215.9mm',
        h: '279.4mm'
    },
    legal: {
        w: '215.9mm',
        h: '355.6mm'
    }
};

function changePageSize(val) {
    const page = document.getElementById('page-render');

    page.style.width = sizes[val].w;
    page.style.minHeight = sizes[val].h;
}

/* =========================
   Field Configurations
========================= */
const fieldConfigs = [
    { id: 'sem',    label: 'Semester',         prefix: 'Semester: ',       sz: 18, align: 'center', pos: 'top' },
    { id: 'code',   label: 'Course Code',      prefix: 'Course Code: ',    sz: 18, align: 'center', pos: 'top' },
    { id: 'course', label: 'Course Name',      prefix: 'Course Name: ',    sz: 19, align: 'center', pos: 'top' },
    { id: 'sec',    label: 'Section',           prefix: 'Section: ',        sz: 17, align: 'center', pos: 'top' },
    { id: 'grp',    label: 'Group',             prefix: 'Group: ',          sz: 17, align: 'center', pos: 'top' },
    { id: 'top',    label: 'Topic Name',        prefix: '',                 sz: 16, align: 'center', pos: 'bottom' },
    { id: 'teach',  label: 'Supervised By',     prefix: '',                 sz: 16, align: 'left',   pos: 'bottom' },
    { id: 'me',     label: 'Submitted By',      prefix: '',                 sz: 16, align: 'left',   pos: 'bottom' },
    { id: 'date',   label: 'Submission Date',  prefix: '', type: 'date',    sz: 15, align: 'left',   pos: 'bottom' }
];

/* =========================
   Sidebar Input Generation
========================= */
fieldConfigs.forEach(field => {

    const container = document.getElementById(
        field.pos === 'top' ? 'top-fields' : 'bottom-fields'
    );

    const div = document.createElement('div');
    div.className = 'input-card';

    div.innerHTML = `
        <label>${field.label}</label>

        <input
            type="${field.type || 'text'}"
            class="text-input"
            id="in-${field.id}"
            oninput="updateView('${field.id}')"
        >

        <div class="style-tools">
            <select id="font-${field.id}" onchange="updateView('${field.id}')">
                <option value="Arial">Arial</option>
                <option value="'Times New Roman'">TNR</option>
            </select>

            <input
                type="number"
                id="sz-${field.id}"
                value="${field.sz}"
                oninput="updateView('${field.id}')"
                style="width:45px;"
            >

            <button
                class="btn-tool active"
                id="b-${field.id}"
                onclick="toggleS('${field.id}','b')"
            >B</button>

            <button
                class="btn-tool ${field.align === 'left' ? 'active' : ''}"
                id="al-${field.id}-left"
                onclick="setAlign('${field.id}','left')"
            >L</button>

            <button
                class="btn-tool ${field.align === 'center' ? 'active' : ''}"
                id="al-${field.id}-center"
                onclick="setAlign('${field.id}','center')"
            >C</button>

            <button
                class="btn-tool ${field.align === 'right' ? 'active' : ''}"
                id="al-${field.id}-right"
                onclick="setAlign('${field.id}','right')"
            >R</button>
        </div>
    `;

    container.appendChild(div);
});

/* =========================
   Alignment Control
========================= */
function setAlign(id, align) {

    const target = (id === 'date')
        ? document.getElementById('out-date-box')
        : document.getElementById(`out-${id}`);

    if (target) {
        target.style.textAlign = align;
    }

    document
        .querySelectorAll(`[id^="al-${id}-"]`)
        .forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.getElementById(`al-${id}-${align}`);
    if (activeBtn) activeBtn.classList.add('active');
}

/* =========================
   Style Toggles
========================= */
function toggleS(id, type) {
    document.getElementById(`${type}-${id}`).classList.toggle('active');
    updateView(id);
}

/* =========================
   Label Type
========================= */
function updateLabelType() {

    const select = document.getElementById('in-label-type');
    const target = document.getElementById('out-label-box');

    if (select.value !== "") {
        target.innerHTML = select.value;
        target.classList.add('visible');
    } else {
        target.classList.remove('visible');
    }
}

/* =========================
   Update Preview View
========================= */
function updateView(id) {

    const config = fieldConfigs.find(c => c.id === id) || { prefix: '' };
    const input  = document.getElementById(`in-${id}`);
    const value  = input ? input.value : "";

    const target = document.getElementById(`out-${id}`);

    if (value && value.trim() !== "") {

        if (id === 'date') {

            const dateBox = document.getElementById('out-date-box');
            dateBox.classList.add('visible');
            dateBox.innerHTML = `
                Date of Submission:
                <span style="font-weight:bold">${value}</span>
            `;

            const sizeInput = document.getElementById(`sz-${id}`);
            if (sizeInput) dateBox.style.fontSize = sizeInput.value + 'px';

        } else if (target) {

            target.classList.add('visible');

            if (['teach', 'me'].includes(id)) {
                document.getElementById('out-sub-info').classList.add('visible');
            }

            target.innerHTML =
                config.prefix === '' ? value : config.prefix + value;

            const sizeInput = document.getElementById(`sz-${id}`);
            if (sizeInput) target.style.fontSize = sizeInput.value + 'px';

            const boldBtn = document.getElementById(`b-${id}`);
            if (boldBtn) {
                target.style.fontWeight =
                    boldBtn.classList.contains('active') ? 'bold' : 'normal';
            }

            const fontSelect = document.getElementById(`font-${id}`);
            if (fontSelect) target.style.fontFamily = fontSelect.value;
        }

    } else {

        if (id === 'date') {
            const dateBox = document.getElementById('out-date-box');
            dateBox.classList.remove('visible');
            dateBox.innerHTML = "";
        } else if (target) {
            target.classList.remove('visible');
        }
    }
}

/* =========================
   Logo Handling
========================= */
function resizeLogo(val) {

    const viewLogo = document.getElementById('viewLogo');

    if (viewLogo) {
        viewLogo.style.width = val + 'px';
        document.getElementById('sizeVal').innerText = val + 'px';
    }
}

document.getElementById('logoIn').onchange = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = res => {
        document.getElementById('viewLogo').src = res.target.result;
        document.getElementById('out-logo-box').classList.add('visible');
    };

    reader.readAsDataURL(file);
};

/* =========================
   Member Table
========================= */
function addMember() {

    const div = document.createElement('div');
    div.className = 'member-entry';

    div.innerHTML = `
        <input type="text" placeholder="Name" class="text-input" oninput="updateMembers()">
        <input type="text" placeholder="ID"   class="text-input" oninput="updateMembers()">
        <button class="btn-remove" onclick="this.parentElement.remove(); updateMembers();">×</button>
    `;

    document.getElementById('member-inputs').appendChild(div);
}

function updateMembers() {

    const entries = document.querySelectorAll('.member-entry');
    const tbody   = document.getElementById('member-body');
    const table   = document.getElementById('table-render');

    tbody.innerHTML = '';
    let hasData = false;

    entries.forEach(entry => {

        const inputs = entry.querySelectorAll('input');

        if (inputs[0].value || inputs[1].value) {
            hasData = true;
            tbody.innerHTML += `
                <tr>
                    <td>${inputs[0].value}</td>
                    <td>${inputs[1].value}</td>
                </tr>
            `;
        }
    });

    table.classList.toggle('visible', hasData);
}

/* =========================
   PDF Download
========================= */
function downloadPDF() {

    const element = document.getElementById('page-render');

    const options = {
        margin: 0,
        filename: 'EduCover_Pro.pdf',
        image: {
            type: 'jpeg',
            quality: 1.0
        },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            height: 1122
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: {
            mode: 'avoid-all'
        }
    };

    html2pdf()
        .from(element)
        .set(options)
        .save();
}
