// Course Objectives Management
let objectiveCounter = 2; // Starting from 2 since we have 2 initial objectives

function addObjective() {
  objectiveCounter++;
  const container = document.getElementById('objectives-container');

  const objectiveItem = document.createElement('div');
  objectiveItem.className = 'objective-item';
  objectiveItem.innerHTML = `
        <textarea placeholder="Enter course objective..." class="objective-input"></textarea>
        <button type="button" class="remove-btn" onclick="removeObjective(this)">Remove</button>
    `;

  container.appendChild(objectiveItem);

  // Focus on the new textarea
  const newTextarea = objectiveItem.querySelector('.objective-input');
  newTextarea.focus();
}

function removeObjective(button) {
  const objectiveItem = button.parentElement;
  const container = document.getElementById('objectives-container');

  // Prevent removing if only one objective remains
  if (container.children.length <= 1) {
    alert('At least one objective must remain.');
    return;
  }

  objectiveItem.remove();
}

// Course Outcomes Management
let outcomeCounter = 5; // Starting from 5 since we have CO1-CO5

function addOutcome() {
  outcomeCounter++;
  const container = document.getElementById('outcomes-container');

  const outcomeItem = document.createElement('div');
  outcomeItem.className = 'outcome-item';
  outcomeItem.innerHTML = `
        <label>CO${outcomeCounter}:</label>
        <textarea placeholder="Enter course outcome..." class="outcome-input"></textarea>
        <button type="button" class="remove-btn" onclick="removeOutcome(this)">Remove</button>
    `;

  container.appendChild(outcomeItem);

  // Add corresponding row to articulation matrix
  addMatrixRow(`CO${outcomeCounter}`);

  // Focus on the new textarea
  const newTextarea = outcomeItem.querySelector('.outcome-input');
  newTextarea.focus();
}

function removeOutcome(button) {
  const outcomeItem = button.parentElement;
  const container = document.getElementById('outcomes-container');

  // Prevent removing if only one outcome remains
  if (container.children.length <= 1) {
    alert('At least one outcome must remain.');
    return;
  }

  // Get the CO label to remove from matrix
  const coLabel = outcomeItem.querySelector('label').textContent.replace(':', '');

  // Remove from articulation matrix
  removeMatrixRow(coLabel);

  // Remove the outcome item
  outcomeItem.remove();

  // Update counter and renumber remaining outcomes
  renumberOutcomes();
}

function renumberOutcomes() {
  const container = document.getElementById('outcomes-container');
  const outcomes = container.querySelectorAll('.outcome-item');

  outcomes.forEach((outcome, index) => {
    const label = outcome.querySelector('label');
    const newCONumber = index + 1;
    label.textContent = `CO${newCONumber}:`;
  });

  // Update outcome counter
  outcomeCounter = outcomes.length;

  // Rebuild the articulation matrix to match current outcomes
  rebuildMatrixRows();
}

// Articulation Matrix Management
function addMatrixRow(coCode) {
  const matrix = document.querySelector('.articulation-matrix tbody');

  const row = document.createElement('tr');
  row.innerHTML = `
        <td>${coCode}</td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
    `;

  matrix.appendChild(row);
}

function removeMatrixRow(coCode) {
  const matrix = document.querySelector('.articulation-matrix tbody');
  const rows = matrix.querySelectorAll('tr');

  rows.forEach(row => {
    const firstCell = row.querySelector('td:first-child');
    if (firstCell && firstCell.textContent === coCode) {
      row.remove();
    }
  });
}

function rebuildMatrixRows() {
  const matrix = document.querySelector('.articulation-matrix tbody');
  const outcomes = document.getElementById('outcomes-container').querySelectorAll('.outcome-item');

  // Clear existing rows
  matrix.innerHTML = '';

  // Add rows for current outcomes
  outcomes.forEach((outcome, index) => {
    const coCode = `CO${index + 1}`;
    addMatrixRow(coCode);
  });
}

// Save and Load Functions
function saveData() {
  const data = {
    objectives: getObjectivesData(),
    outcomes: getOutcomesData(),
    matrix: getMatrixData(),
    content: getContentData(),
    resources: getResourcesData(),
    pedagogy: getPedagogyData(),
    skillMatrix: getSkillMatrixData()
  };

  localStorage.setItem('courseData', JSON.stringify(data));
  alert('Data saved successfully!');
}

function loadData() {
  const savedData = localStorage.getItem('courseData');
  if (savedData) {
    const data = JSON.parse(savedData);
    loadObjectivesData(data.objectives);
    loadOutcomesData(data.outcomes);
    loadMatrixData(data.matrix);
    if (data.content) {
      loadContentData(data.content);
    }
    if (data.resources) {
      loadResourcesData(data.resources);
    }
    if (data.pedagogy) {
      loadPedagogyData(data.pedagogy);
    }
    if (data.skillMatrix) {
      loadSkillMatrixData(data.skillMatrix);
    }
    alert('Data loaded successfully!');
  } else {
    alert('No saved data found.');
  }
}

function getObjectivesData() {
  const objectives = [];
  const textareas = document.querySelectorAll('#objectives-container .objective-input');
  textareas.forEach(textarea => {
    objectives.push(textarea.value);
  });
  return objectives;
}

function getOutcomesData() {
  const outcomes = [];
  const container = document.getElementById('outcomes-container');
  const items = container.querySelectorAll('.outcome-item');

  items.forEach(item => {
    const label = item.querySelector('label').textContent;
    const value = item.querySelector('.outcome-input').value;
    outcomes.push({ label, value });
  });
  return outcomes;
}

function getMatrixData() {
  const matrix = [];
  const rows = document.querySelectorAll('.articulation-matrix tbody tr');

  rows.forEach(row => {
    const coCode = row.querySelector('td:first-child').textContent;
    const checkboxes = row.querySelectorAll('input[type="checkbox"]');
    const values = Array.from(checkboxes).map(cb => cb.checked);
    matrix.push({ coCode, values });
  });
  return matrix;
}

function getContentData() {
  const content = [];
  const container = document.getElementById('content-container');
  const items = container.querySelectorAll('.content-item');

  items.forEach(item => {
    const unitLabel = item.querySelector('.content-unit label').textContent;
    const unitTitle = item.querySelector('.unit-title-input').value;
    const unitContent = item.querySelector('.content-input').value;
    const unitHours = item.querySelector('.hours-input').value;
    content.push({ unitLabel, unitTitle, unitContent, unitHours });
  });
  return content;
}

function getResourcesData() {
  const resources = {};
  const sections = document.querySelectorAll('.resource-subsection');

  sections.forEach((section, index) => {
    const title = section.querySelector('h4').textContent;
    const items = [];
    const resourceInputs = section.querySelectorAll('.resource-input');

    resourceInputs.forEach(input => {
      items.push(input.value);
    });

    resources[`section_${index}`] = {
      title: title,
      items: items
    };
  });

  return resources;
}

function getPedagogyData() {
  const pedagogy = [];
  const inputs = document.querySelectorAll('#pedagogy-container .pedagogy-input');

  inputs.forEach(input => {
    pedagogy.push(input.value);
  });

  return pedagogy;
}

function getSkillMatrixData() {
  const skillMatrix = [];
  const rows = document.querySelectorAll('.skill-matrix tbody tr');

  rows.forEach(row => {
    const co = row.querySelector('td:first-child').textContent;
    const bloom = row.querySelector('.bloom-input').value;
    const skill = row.querySelector('.skill-input').value;
    const assessment = row.querySelector('.assessment-input').value;

    skillMatrix.push({ co, bloom, skill, assessment });
  });

  return skillMatrix;
}

function loadObjectivesData(objectives) {
  const container = document.getElementById('objectives-container');
  container.innerHTML = '';

  objectives.forEach(objective => {
    const objectiveItem = document.createElement('div');
    objectiveItem.className = 'objective-item';
    objectiveItem.innerHTML = `
            <textarea placeholder="Enter course objective..." class="objective-input">${objective}</textarea>
            <button type="button" class="remove-btn" onclick="removeObjective(this)">Remove</button>
        `;
    container.appendChild(objectiveItem);
  });

  objectiveCounter = objectives.length;
}

function loadOutcomesData(outcomes) {
  const container = document.getElementById('outcomes-container');
  container.innerHTML = '';

  outcomes.forEach(outcome => {
    const outcomeItem = document.createElement('div');
    outcomeItem.className = 'outcome-item';
    outcomeItem.innerHTML = `
            <label>${outcome.label}</label>
            <textarea placeholder="Enter course outcome..." class="outcome-input">${outcome.value}</textarea>
            <button type="button" class="remove-btn" onclick="removeOutcome(this)">Remove</button>
        `;
    container.appendChild(outcomeItem);
  });

  outcomeCounter = outcomes.length;
}

function loadMatrixData(matrix) {
  const tbody = document.querySelector('.articulation-matrix tbody');
  tbody.innerHTML = '';

  matrix.forEach(row => {
    const tr = document.createElement('tr');
    let html = `<td>${row.coCode}</td>`;

    row.values.forEach(checked => {
      html += `<td><input type="checkbox" ${checked ? 'checked' : ''}></td>`;
    });

    tr.innerHTML = html;
    tbody.appendChild(tr);
  });
}

function loadContentData(content) {
  const container = document.getElementById('content-container');
  container.innerHTML = '';

  content.forEach(item => {
    const contentItem = document.createElement('div');
    contentItem.className = 'content-item';
    contentItem.innerHTML = `
      <div class="content-unit">
        <label>${item.unitLabel}</label>
        <input type="text" placeholder="Enter unit title..." class="unit-title-input" value="${item.unitTitle}">
      </div>
      <div class="content-details">
        <textarea placeholder="Enter unit content..." class="content-input">${item.unitContent}</textarea>
      </div>
      <div class="content-hours">
        <label>Hours:</label>
        <input type="number" placeholder="Hours" class="hours-input" value="${item.unitHours}" min="1">
      </div>
      <button type="button" class="remove-btn" onclick="removeContent(this)">Remove</button>
    `;
    container.appendChild(contentItem);
  });

  contentCounter = content.length;
}

function loadResourcesData(resources) {
  const resourcesContainer = document.getElementById('resources-container');
  resourcesContainer.innerHTML = '';

  Object.keys(resources).forEach((key, index) => {
    const section = resources[key];
    const resourceSection = document.createElement('div');
    resourceSection.className = 'resource-subsection';

    let itemsHtml = '';
    section.items.forEach(item => {
      itemsHtml += `
        <div class="resource-item">
          <textarea placeholder="Enter resource item..." class="resource-input">${item}</textarea>
          <button type="button" class="remove-btn" onclick="removeResourceItem(this)">Remove</button>
        </div>
      `;
    });

    resourceSection.innerHTML = `
      <h4>${section.title}</h4>
      <div class="form-container">
        <div id="resource-section-${index + 1}-container">
          ${itemsHtml}
        </div>
        <div class="form-buttons">
          <button type="button" class="add-btn" onclick="addResourceItem('resource-section-${index + 1}-container')">Add Item</button>
        </div>
      </div>
      ${index >= 4 ? '<button type="button" class="remove-btn" onclick="removeResourceSection(this)" style="margin-top: 10px;">Remove Section</button>' : ''}
    `;

    resourcesContainer.appendChild(resourceSection);
  });

  resourceSectionCounter = Object.keys(resources).length;
}

function loadPedagogyData(pedagogy) {
  const container = document.getElementById('pedagogy-container');
  container.innerHTML = '';

  pedagogy.forEach(item => {
    const pedagogyItem = document.createElement('div');
    pedagogyItem.className = 'pedagogy-item';
    pedagogyItem.innerHTML = `
      <textarea placeholder="Enter pedagogy method..." class="pedagogy-input">${item}</textarea>
      <button type="button" class="remove-btn" onclick="removePedagogyItem(this)">Remove</button>
    `;
    container.appendChild(pedagogyItem);
  });
}

function loadSkillMatrixData(skillMatrix) {
  const rows = document.querySelectorAll('.skill-matrix tbody tr');

  skillMatrix.forEach((data, index) => {
    if (rows[index]) {
      const row = rows[index];
      row.querySelector('.bloom-input').value = data.bloom;
      row.querySelector('.skill-input').value = data.skill;
      row.querySelector('.assessment-input').value = data.assessment;
    }
  });
}

// Export Functions
function exportToJSON() {
  const data = {
    objectives: getObjectivesData(),
    outcomes: getOutcomesData(),
    matrix: getMatrixData(),
    content: getContentData(),
    resources: getResourcesData(),
    pedagogy: getPedagogyData(),
    skillMatrix: getSkillMatrixData()
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'course-syllabus-data.json';
  link.click();
}

function printDocument() {
  window.print();
}

// Course Content Management
let contentCounter = 5; // Starting from 5 since we have Unit 1-5

function addContent() {
  contentCounter++;
  const container = document.getElementById('content-container');

  const contentItem = document.createElement('div');
  contentItem.className = 'content-item';
  contentItem.innerHTML = `
    <div class="content-unit">
      <label>Unit ${contentCounter}:</label>
      <input type="text" placeholder="Enter unit title..." class="unit-title-input">
    </div>
    <div class="content-details">
      <textarea placeholder="Enter unit content..." class="content-input"></textarea>
    </div>
    <div class="content-hours">
      <label>Hours:</label>
      <input type="number" placeholder="Hours" class="hours-input" value="10" min="1">
    </div>
    <button type="button" class="remove-btn" onclick="removeContent(this)">Remove</button>
  `;

  container.appendChild(contentItem);

  // Focus on the new unit title input
  const newInput = contentItem.querySelector('.unit-title-input');
  newInput.focus();
}

function removeContent(button) {
  const contentItem = button.parentElement;
  const container = document.getElementById('content-container');

  // Prevent removing if only one content item remains
  if (container.children.length <= 1) {
    alert('At least one unit must remain.');
    return;
  }

  // Remove the content item
  contentItem.remove();

  // Update counter and renumber remaining units
  renumberContentUnits();
}

function renumberContentUnits() {
  const container = document.getElementById('content-container');
  const contentItems = container.querySelectorAll('.content-item');

  contentItems.forEach((item, index) => {
    const label = item.querySelector('.content-unit label');
    const newUnitNumber = index + 1;
    label.textContent = `Unit ${newUnitNumber}:`;
  });

  // Update content counter
  contentCounter = contentItems.length;
}

// Pagination Management
let currentPage = 5; // Start on page 5 as it's marked active
const totalPages = 5; // Updated to 5 pages

function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages) return;

  // Remove active class from all page buttons
  const pageButtons = document.querySelectorAll('.page-btn');
  pageButtons.forEach(btn => btn.classList.remove('active'));

  // Add active class to clicked button
  const clickedButton = [...pageButtons].find(btn => btn.textContent == pageNumber);
  if (clickedButton) {
    clickedButton.classList.add('active');
  }

  currentPage = pageNumber;
  updateNavigationButtons();

  // Here you can add logic to show/hide different sections based on page
  console.log(`Navigated to page ${pageNumber}`);
}

function nextPage() {
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
}

function previousPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
    prevBtn.style.opacity = currentPage <= 1 ? '0.5' : '1';
  }

  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.style.opacity = currentPage >= totalPages ? '0.5' : '1';
  }
}

// Resources Management
let resourceSectionCounter = 4; // Starting from 4 since we have a, b, c, d

function addResourceItem(containerId) {
  const container = document.getElementById(containerId);

  const resourceItem = document.createElement('div');
  resourceItem.className = 'resource-item';
  resourceItem.innerHTML = `
    <textarea placeholder="Enter resource item..." class="resource-input"></textarea>
    <button type="button" class="remove-btn" onclick="removeResourceItem(this)">Remove</button>
  `;

  container.appendChild(resourceItem);

  // Focus on the new textarea
  const newTextarea = resourceItem.querySelector('.resource-input');
  newTextarea.focus();
}

function removeResourceItem(button) {
  const resourceItem = button.parentElement;
  const container = resourceItem.parentElement;

  // Prevent removing if only one item remains in the section
  if (container.children.length <= 1) {
    alert('At least one item must remain in this section.');
    return;
  }

  resourceItem.remove();
}

function addResourceSection() {
  resourceSectionCounter++;
  const resourcesContainer = document.getElementById('resources-container');
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const letter = letters[resourceSectionCounter - 1];

  const newSection = document.createElement('div');
  newSection.className = 'resource-subsection';
  newSection.innerHTML = `
    <h4>${letter}) New Resource Section</h4>
    <div class="form-container">
      <div id="resource-section-${resourceSectionCounter}-container">
        <div class="resource-item">
          <textarea placeholder="Enter resource item..." class="resource-input"></textarea>
          <button type="button" class="remove-btn" onclick="removeResourceItem(this)">Remove</button>
        </div>
      </div>
      <div class="form-buttons">
        <button type="button" class="add-btn" onclick="addResourceItem('resource-section-${resourceSectionCounter}-container')">Add Item</button>
      </div>
    </div>
    <button type="button" class="remove-btn" onclick="removeResourceSection(this)" style="margin-top: 10px;">Remove Section</button>
  `;

  resourcesContainer.appendChild(newSection);
}

function removeResourceSection(button) {
  const section = button.parentElement;
  const container = document.getElementById('resources-container');

  // Prevent removing if only core sections remain
  if (container.children.length <= 4) {
    alert('Cannot remove core resource sections (a, b, c, d).');
    return;
  }

  section.remove();
  renumberResourceSections();
}

function renumberResourceSections() {
  const sections = document.querySelectorAll('.resource-subsection');
  const letters = 'abcdefghijklmnopqrstuvwxyz';

  sections.forEach((section, index) => {
    const h4 = section.querySelector('h4');
    const currentText = h4.textContent;
    const newLetter = letters[index];
    h4.textContent = currentText.replace(/^[a-z]\)/, `${newLetter})`);
  });

  resourceSectionCounter = sections.length;
}

// Pedagogy Management
function addPedagogyItem() {
  const container = document.getElementById('pedagogy-container');

  const pedagogyItem = document.createElement('div');
  pedagogyItem.className = 'pedagogy-item';
  pedagogyItem.innerHTML = `
    <textarea placeholder="Enter pedagogy method..." class="pedagogy-input"></textarea>
    <button type="button" class="remove-btn" onclick="removePedagogyItem(this)">Remove</button>
  `;

  container.appendChild(pedagogyItem);

  // Focus on the new textarea
  const newTextarea = pedagogyItem.querySelector('.pedagogy-input');
  newTextarea.focus();
}

function removePedagogyItem(button) {
  const pedagogyItem = button.parentElement;
  const container = document.getElementById('pedagogy-container');

  // Prevent removing if only one item remains
  if (container.children.length <= 1) {
    alert('At least one pedagogy method must remain.');
    return;
  }

  pedagogyItem.remove();
}

// Rubrics Mapping Table Management
let rubricsQuestionCounter = 20; // Starting from Q20 since we have Q01-Q20

function addRubricsRow() {
  const table = document.querySelector('.rubrics-mapping-table tbody');
  rubricsQuestionCounter++;

  const newRow = document.createElement('tr');
  const questionNumber = `Q${rubricsQuestionCounter.toString().padStart(2, '0')}`;

  newRow.innerHTML = `
    <td style="position: relative;">
      ${questionNumber}
      <button type="button" class="remove-btn" onclick="removeRubricsRow(this)" style="position: absolute; right: -60px; top: 50%; transform: translateY(-50%); padding: 2px 6px; font-size: 0.7rem; background-color: #dc2626; color: white; border: none; border-radius: 3px; cursor: pointer;">×</button>
    </td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
    <td><input type="checkbox"></td>
  `;

  table.appendChild(newRow);
}

function removeRubricsRow(button) {
  const row = button.closest('tr');
  const table = document.querySelector('.rubrics-mapping-table tbody');

  // Prevent removing if only a few rows remain
  if (table.children.length <= 5) {
    alert('At least 5 question rows must remain.');
    return;
  }

  row.remove();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  // Initialize pagination
  updateNavigationButtons();

  // Auto-save functionality
  let autoSaveTimer;
  const inputs = document.querySelectorAll('textarea, input[type="checkbox"], input[type="text"], input[type="number"]');

  function setupAutoSave() {
    document.addEventListener('input', function () {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(function () {
        saveData();
        console.log('Auto-saved');
      }, 5000); // Auto-save after 5 seconds of inactivity
    });
  }

  setupAutoSave();
});

// Scroll to bottom function
function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}
