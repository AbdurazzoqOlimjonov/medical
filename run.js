// ============ DATA ============
const doctors = {
	cardiology: [
		{ name: 'Dr. Abdulla Aliyev', specialty: 'Kardiologiya Mutaxassisi' },
		{ name: 'Dr. Farogat Abdullaeva', specialty: 'Kardiologiya Mutaxassisi' },
		{ name: 'Dr. Botir Qodirov', specialty: 'Kardiologiya Mutaxassisi' },
	],
	orthopedics: [
		{ name: 'Dr. Rustam Usmonov', specialty: 'Ortopediya Mutaxassisi' },
		{ name: 'Dr. Dilshod Karimov', specialty: 'Ortopediya Mutaxassisi' },
		{ name: 'Dr. Malika Ergasheva', specialty: 'Ortopediya Mutaxassisi' },
	],
	neurology: [
		{ name: 'Dr. Anvar Mirzayev', specialty: 'Nevrologiya Mutaxassisi' },
		{ name: 'Dr. Sohiba Rahmatova', specialty: 'Nevrologiya Mutaxassisi' },
		{ name: 'Dr. Timur Olimov', specialty: 'Nevrologiya Mutaxassisi' },
	],
	dermatology: [
		{ name: 'Dr. Gulnoza Xudoyarova', specialty: 'Dermatologiya Mutaxassisi' },
		{ name: 'Dr. Ravshan Xamroyev', specialty: 'Dermatologiya Mutaxassisi' },
		{ name: 'Dr. Nazira Abdullayeva', specialty: 'Dermatologiya Mutaxassisi' },
	],
	pediatrics: [
		{ name: 'Dr. Manzura Ibragimova', specialty: 'Bolalar Kasalliklari Mutaxassisi' },
		{ name: 'Dr. Kadir Yaqubov', specialty: 'Bolalar Kasalliklari Mutaxassisi' },
		{ name: 'Dr. Feroza Qoʻchqorov', specialty: 'Bolalar Kasalliklari Mutaxassisi' },
	],
	ophthalmology: [
		{ name: 'Dr. Akmal Hasanov', specialty: 'Oftalmologiya Mutaxassisi' },
		{ name: 'Dr. Shoxista Joʻraboyeva', specialty: 'Oftalmologiya Mutaxassisi' },
		{ name: 'Dr. Miroj Tolibov', specialty: 'Oftalmologiya Mutaxassisi' },
	],
	dentistry: [
		{ name: 'Dr. Oybek Tokhirov', specialty: 'Stomatolog' },
		{ name: 'Dr. Yasmin Karimova', specialty: 'Stomatolog' },
		{ name: 'Dr. Rustam Nosirov', specialty: 'Stomatolog' },
	],
};

const nurses = [
	'Hamidova Zulfiya',
	'Qodirova Munira',
	'Hasanova Gʻulbakhor',
	'Rustamova Zamira',
	'Akbarova Nigora',
	'Karimova Dilafruz',
	'Abdullayeva Shodiya',
];

let currentPatientData = null;

// ============ UTILS ============
function showToast(message, type = 'info', duration = 4000) {
	const container = document.getElementById('toastContainer');
	const toast = document.createElement('div');
	toast.className = `toast ${type}`;

	const icons = {
		success: '✓',
		error: '✕',
		info: 'ℹ',
		warning: '⚠',
	};

	toast.innerHTML = `
                <div class="toast-icon">${icons[type]}</div>
                <div class="toast-message">${message}</div>
                <div class="toast-close" onclick="this.parentElement.remove()">×</div>
            `;

	container.appendChild(toast);

	setTimeout(() => {
		toast.classList.add('exit');
		setTimeout(() => toast.remove(), 300);
	}, duration);
}

function clearErrors() {
	document.querySelectorAll('.error-message').forEach(el => {
		el.classList.remove('show');
	});
	document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
		el.classList.remove('error', 'success');
	});
}

function setFieldError(fieldId, message) {
	const field = document.getElementById(fieldId);
	const errorEl = document.getElementById(fieldId + 'Error');
	if (field && errorEl) {
		field.classList.add('error');
		field.classList.remove('success');
		errorEl.textContent = message;
		errorEl.classList.add('show');
		return false;
	}
	return true;
}

function setFieldSuccess(fieldId) {
	const field = document.getElementById(fieldId);
	const errorEl = document.getElementById(fieldId + 'Error');
	if (field && errorEl) {
		field.classList.add('success');
		field.classList.remove('error');
		errorEl.classList.remove('show');
	}
}

function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
	return /^[\d+\-\s()]{10,}$/.test(phone.replace(/\s/g, ''));
}

function getRandomNurse() {
	return nurses[Math.floor(Math.random() * nurses.length)];
}

function getSpecialtyName(value) {
	const specialties = {
		cardiology: 'Kardiologiya (Yurak kasalliklari)',
		orthopedics: 'Ortopediya (Suyak va muskul kasalliklari)',
		neurology: 'Nevrologiya (Nerv tizimi kasalliklari)',
		dermatology: 'Dermatologiya (Teri kasalliklari)',
		pediatrics: 'Bolalar Kasalliklari',
		ophthalmology: "Oftalmologiya (Ko'z kasalliklari)",
		dentistry: 'Stomatologiya (Tish kasalliklari)',
	};
	return specialties[value] || value;
}

// ============ FORM HANDLERS ============
document.getElementById('specialty').addEventListener('change', function () {
	clearErrors();
	const doctorSelect = document.getElementById('doctor');
	const specialty = this.value;

	doctorSelect.innerHTML = '<option value="">-- Doktor Tanlang --</option>';

	if (specialty && doctors[specialty]) {
		doctors[specialty].forEach((doc, index) => {
			const option = document.createElement('option');
			option.value = specialty + '_' + index;
			option.textContent = doc.name;
			doctorSelect.appendChild(option);
		});
		setFieldSuccess('specialty');
	}
});

// ============ REGISTRATION ============
function registerPatient() {
	clearErrors();
	let isValid = true;

	// Get form values
	const firstName = document.getElementById('firstName').value?.trim() || '';
	const dob = document.getElementById('dob').value;
	const phone = document.getElementById('phone').value?.trim() || '';
	const visitReason = document.getElementById('visitReason').value;
	const specialty = document.getElementById('specialty').value;
	const doctorValue = document.getElementById('doctor').value;
	const symptoms = document.getElementById('symptoms').value?.trim() || '';

	// Validate
	if (!firstName) {
		setFieldError('firstName', 'Bemor ismini kiriting');
		isValid = false;
	} else if (firstName.length < 3) {
		setFieldError('firstName', "Ism kamida 3 ta harfdan iborat bo'lishi kerak");
		isValid = false;
	} else {
		setFieldSuccess('firstName');
	}

	if (!dob) {
		setFieldError('dob', "Tug'ilgan sanani kiriting");
		isValid = false;
	} else {
		const dobDate = new Date(dob);
		const today = new Date();
		if (dobDate > today) {
			setFieldError('dob', "Tug'ilgan sana kelajak sanadan oldin bo'lishi kerak");
			isValid = false;
		} else if (today.getFullYear() - dobDate.getFullYear() < 0) {
			setFieldError('dob', "Noto'g'ri sana");
			isValid = false;
		} else {
			setFieldSuccess('dob');
		}
	}

	if (!phone) {
		setFieldError('phone', 'Telefon raqamini kiriting');
		isValid = false;
	} else if (!validatePhone(phone)) {
		setFieldError('phone', "Noto'g'ri telefon raqami formati");
		isValid = false;
	} else {
		setFieldSuccess('phone');
	}

	if (!visitReason) {
		setFieldError('visitReason', "Ki'rish sababini tanlang");
		isValid = false;
	} else {
		setFieldSuccess('visitReason');
	}

	if (!specialty) {
		setFieldError('specialty', 'Mutaxassislikni tanlang');
		isValid = false;
	} else {
		setFieldSuccess('specialty');
	}

	if (!doctorValue) {
		setFieldError('doctor', 'Doktor tanlang');
		isValid = false;
	} else {
		setFieldSuccess('doctor');
	}

	if (!isValid) {
		showToast("Iltimos, barcha xatolarni to'g'irlang", 'error');
		return;
	}

	// Disable submit button
	const submitBtn = document.getElementById('submitBtn');
	submitBtn.disabled = true;

	// Simulate processing delay
	setTimeout(() => {
		try {
			const [specialtyCode, doctorIndex] = doctorValue.split('_');
			const doctor = doctors[specialtyCode][doctorIndex];
			const nurse = getRandomNurse();

			// Store current patient data
			currentPatientData = {
				firstName,
				dob,
				phone,
				visitReason,
				specialty,
				doctor,
				nurse,
				symptoms,
			};

			// Display patient info
			displayPatientInfo(firstName, dob, phone, visitReason, specialty, doctor, nurse, symptoms);

			// Display receipt
			generateReceipt(firstName, dob, phone, visitReason, specialty, doctor, nurse, symptoms);

			showToast("✓ Bemor muvaffaqiyatli ro'yxatga olingan!", 'success');

			// Scroll to receipt
			document.getElementById('receiptSection').scrollIntoView({ behavior: 'smooth' });
		} catch (error) {
			console.error('Error:', error);
			showToast("Xato yuz berdi. Qayta urinib ko'ring", 'error');
		} finally {
			submitBtn.disabled = false;
		}
	}, 500);
}

function displayPatientInfo(name, dob, phone, reason, specialty, doctor, nurse, symptoms) {
	try {
		const dobDate = new Date(dob);
		const age = new Date().getFullYear() - dobDate.getFullYear();

		const reasonLabels = {
			consultation: '🔍 Konsultatsiya',
			checkup: '🩺 Tibbiy Tekshirish',
			treatment: '💊 Davolash',
			surgery: '🏥 Jarrohlik Operatsiyasi',
			emergency: '🚨 Shoshqoqlik Yordami',
		};

		let html = `
                    <div class="info-section">
                        <div class="info-label">Bemor Ismi</div>
                        <div class="info-value">${name}</div>
                    </div>

                    <div class="info-section">
                        <div class="info-label">Yosh / Tug'ilgan Sanasi</div>
                        <div class="info-value">${age} yosh (${dobDate.toLocaleDateString('uz-UZ')})</div>
                    </div>

                    <div class="info-section">
                        <div class="info-label">Telefon Raqami</div>
                        <div class="info-value">${phone}</div>
                    </div>

                    <div class="info-section">
                        <div class="info-label">Ki'rish Sababi</div>
                        <div class="info-value">${reasonLabels[reason]}</div>
                    </div>

                    <div class="info-section">
                        <div class="info-label">Mutaxassislik</div>
                        <div class="info-value">${getSpecialtyName(specialty)}</div>
                    </div>

                    <div class="info-section">
                        <div class="info-label">Tayinlangan Doktor</div>
                        <div class="doctor-card">
                            <div class="doctor-name">👨‍⚕️ ${doctor.name}</div>
                            <div class="doctor-specialty">${doctor.specialty}</div>
                        </div>
                    </div>

                    <div class="info-section">
                        <div class="info-label">Shifkor (Hamshira)</div>
                        <div class="doctor-card">
                            <div class="doctor-name">👩‍⚕️ ${nurse}</div>
                            <div class="doctor-specialty">Tibbiy Hamshira</div>
                        </div>
                    </div>

                    <div class="status-badge">✓ Ro'yxatga Olingan</div>
                `;

		if (symptoms) {
			html += `
                        <div class="info-section">
                            <div class="info-label">Shikoyatlar</div>
                            <div class="info-value">${symptoms}</div>
                        </div>
                    `;
		}

		document.getElementById('patientInfo').innerHTML = html;
	} catch (error) {
		console.error('Display error:', error);
		showToast("Ma'lumotlarni ko'rsatishda xato", 'error');
	}
}

function generateReceipt(name, dob, phone, reason, specialty, doctor, nurse, symptoms) {
	try {
		const receiptNum = 'CHK-' + Date.now().toString().slice(-8).toUpperCase();
		const regNum =
			'REG-' +
			new Date().getFullYear() +
			Math.floor(Math.random() * 100000)
				.toString()
				.padStart(5, '0');
		const currentDate = new Date().toLocaleDateString('uz-UZ');
		const currentTime = new Date().toLocaleTimeString('uz-UZ');

		const reasonLabels = {
			consultation: 'Konsultatsiya',
			checkup: 'Tibbiy Tekshirish',
			treatment: 'Davolash',
			surgery: 'Jarrohlik Operatsiyasi',
			emergency: 'Shoshqoqlik Yordami',
		};

		const html = `
                    <div class="receipt-header">🏥 TIB MARKAZI</div>
                    <div style="font-size: 11px; margin-bottom: 10px; color: var(--text-secondary);">Bemorni Ro'yxatga Olish Cheki</div>

                    <div style="border-top: 2px dashed var(--primary); border-bottom: 2px dashed var(--primary); padding: 10px 0; margin: 10px 0;">
                        <div class="receipt-line">
                            <label>Ro'yxat Raqami:</label>
                            <value>${regNum}</value>
                        </div>
                        <div class="receipt-line">
                            <label>Chek Raqami:</label>
                            <value>${receiptNum}</value>
                        </div>
                    </div>

                    <div class="receipt-line">
                        <label>Bemor:</label>
                        <value>${name}</value>
                    </div>
                    <div class="receipt-line">
                        <label>Telefon:</label>
                        <value>${phone}</value>
                    </div>
                    <div class="receipt-line">
                        <label>Ki'rish Sababi:</label>
                        <value>${reasonLabels[reason]}</value>
                    </div>
                    <div class="receipt-line">
                        <label>Mutaxassislik:</label>
                        <value>${getSpecialtyName(specialty)}</value>
                    </div>
                    <div class="receipt-line">
                        <label>Doktor:</label>
                        <value>${doctor.name}</value>
                    </div>
                    <div class="receipt-line">
                        <label>Shifkor:</label>
                        <value>${nurse}</value>
                    </div>

                    <div style="border-top: 2px dashed var(--primary); border-bottom: 2px dashed var(--primary); padding: 10px 0; margin: 10px 0;">
                        <div class="receipt-line">
                            <label>Sana:</label>
                            <value>${currentDate}</value>
                        </div>
                        <div class="receipt-line">
                            <label>Vaqt:</label>
                            <value>${currentTime}</value>
                        </div>
                    </div>

                    <div class="receipt-footer">
                        ✓ Bemor ro'yxatga olingan va tayinlangan doktorga yuborilgan
                        <br>
                        Ushbu chekni saqlab qoling
                        <br><br>
                        <strong>Rahmat!</strong>
                    </div>
                `;

		document.getElementById('receiptContent').innerHTML = html;
		document.getElementById('receiptSection').classList.add('active');
	} catch (error) {
		console.error('Receipt generation error:', error);
		showToast('Chekni yaratishda xato', 'error');
	}
}

// ============ RECEIPT ACTIONS ============
function printReceipt() {
	try {
		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			showToast('Yangi oyna ochishga ruxsat berilmagan', 'error');
			return;
		}

		const content = document.getElementById('receiptContent').innerHTML;
		printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Tibbiy Chek</title>
                        <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body {
                                font-family: 'Courier New', monospace;
                                padding: 20px;
                                background: white;
                            }
                            .receipt {
                                border: 2px dashed #0D7A7A;
                                padding: 20px;
                                text-align: center;
                                max-width: 400px;
                                margin: 0 auto;
                                line-height: 1.8;
                            }
                            .receipt-header {
                                font-size: 16px;
                                font-weight: bold;
                                margin-bottom: 10px;
                            }
                            .receipt-line {
                                display: flex;
                                justify-content: space-between;
                                font-size: 12px;
                                margin-bottom: 5px;
                                border-bottom: 1px dotted #ccc;
                                padding-bottom: 5px;
                            }
                            @media print {
                                body { padding: 0; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="receipt">
                            ${content}
                        </div>
                    </body>
                    </html>
                `);
		printWindow.document.close();
		setTimeout(() => printWindow.print(), 500);
		showToast('Chap qilish dialogi ochildi', 'success');
	} catch (error) {
		console.error('Print error:', error);
		showToast('Chap qilishda xato', 'error');
	}
}

function downloadReceipt() {
	try {
		const element = document.getElementById('receiptContent');
		const text = element.innerText;
		const filename = `chek_${new Date().getTime()}.txt`;

		const link = document.createElement('a');
		link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		showToast('Chek saqlandi: ' + filename, 'success');
	} catch (error) {
		console.error('Download error:', error);
		showToast('Saqlashda xato', 'error');
	}
}

function openEmailModal() {
	try {
		if (!currentPatientData) {
			showToast("Avval bemorni ro'yxatga oling", 'warning');
			return;
		}
		document.getElementById('emailModal').classList.add('active');
		document.getElementById('emailInput').value = '';
		document.getElementById('emailInput').focus();
	} catch (error) {
		console.error('Modal error:', error);
		showToast('Xato yuz berdi', 'error');
	}
}

function closeEmailModal() {
	document.getElementById('emailModal').classList.remove('active');
}

function sendEmail() {
	try {
		const email = document.getElementById('emailInput').value?.trim() || '';

		if (!email) {
			showToast('Email manzilini kiriting', 'warning');
			return;
		}

		if (!validateEmail(email)) {
			showToast("Noto'g'ri email formati", 'error');
			return;
		}

		// Simulate email sending
		const btn = event.target;
		btn.disabled = true;
		btn.innerHTML = '<span class="btn-loader"></span> Yuborilmoqda...';

		setTimeout(() => {
			showToast('📧 Chek ' + email + ' ga yuborildi!', 'success');
			closeEmailModal();
			btn.disabled = false;
			btn.innerHTML = 'Yuborish';
		}, 1500);
	} catch (error) {
		console.error('Email error:', error);
		showToast('Emailni yuborishda xato', 'error');
	}
}

function newPatient() {
	try {
		if (confirm('Yangi bemor uchun formani tozalamoqchimisiz?')) {
			document.getElementById('patientForm').reset();
			document.getElementById('receiptSection').classList.remove('active');
			document.getElementById('patientInfo').innerHTML = `
                        <div class="empty-state">
                            <p>👈 Chap tarafdagi forma orqali bemorning ma\'lumotlarini kiriting</p>
                        </div>
                    `;
			document.getElementById('doctor').innerHTML = '<option value="">-- Birinchi mutaxassislikni tanlang --</option>';
			document.getElementById('firstName').focus();
			clearErrors();
			currentPatientData = null;
			showToast('✓ Form tozalandi', 'success');
		}
	} catch (error) {
		console.error('Reset error:', error);
		showToast('Formani tozalashda xato', 'error');
	}
}

// ============ KEYBOARD SUPPORT ============
document.addEventListener('keypress', function (event) {
	if (event.key === 'Enter') {
		const activeElement = document.activeElement;
		if (activeElement.id === 'emailInput') {
			sendEmail();
		} else if (activeElement.closest('#patientForm')) {
			registerPatient();
		}
	}
});

// Close modal when clicking outside
window.addEventListener('click', function (event) {
	const modal = document.getElementById('emailModal');
	if (event.target === modal) {
		closeEmailModal();
	}
});
