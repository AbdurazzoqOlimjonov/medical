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
	'Raxmanova Gulnoza',
	'Xolmatova Makhmuda',
];

let currentPatientData = null;

function showToast(message, type = 'info', duration = 4000) {
	const container = document.getElementById('toastContainer');
	const toast = document.createElement('div');
	toast.className = `toast ${type}`;
	const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
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
	document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
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

function registerPatient() {
	clearErrors();
	let isValid = true;

	const firstName = document.getElementById('firstName').value?.trim() || '';
	const dob = document.getElementById('dob').value;
	const phone = document.getElementById('phone').value?.trim() || '';
	const visitReason = document.getElementById('visitReason').value;
	const specialty = document.getElementById('specialty').value;
	const doctorValue = document.getElementById('doctor').value;
	const symptoms = document.getElementById('symptoms').value?.trim() || '';

	if (!firstName) {
		setFieldError('firstName', 'Ismni kiriting');
		isValid = false;
	} else if (firstName.length < 3) {
		setFieldError('firstName', 'Kamida 3 ta harf');
		isValid = false;
	} else {
		setFieldSuccess('firstName');
	}

	if (!dob) {
		setFieldError('dob', 'Sanani kiriting');
		isValid = false;
	} else {
		const dobDate = new Date(dob);
		if (dobDate > new Date()) {
			setFieldError('dob', "Noto'g'ri sana");
			isValid = false;
		} else {
			setFieldSuccess('dob');
		}
	}

	if (!phone) {
		setFieldError('phone', 'Raqamni kiriting');
		isValid = false;
	} else if (!validatePhone(phone)) {
		setFieldError('phone', "Noto'g'ri format");
		isValid = false;
	} else {
		setFieldSuccess('phone');
	}

	if (!visitReason) {
		setFieldError('visitReason', 'Sababni tanlang');
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
		setFieldError('doctor', 'Doktorni tanlang');
		isValid = false;
	} else {
		setFieldSuccess('doctor');
	}

	if (!isValid) {
		showToast("Xatolarni to'g'irlang", 'error');
		return;
	}

	const submitBtn = document.getElementById('submitBtn');
	submitBtn.disabled = true;

	setTimeout(() => {
		try {
			const [specialtyCode, doctorIndex] = doctorValue.split('_');
			const doctor = doctors[specialtyCode][doctorIndex];
			const nurse = getRandomNurse();

			currentPatientData = { firstName, dob, phone, visitReason, specialty, doctor, nurse, symptoms };

			displayPatientInfo(firstName, dob, phone, visitReason, specialty, doctor, nurse, symptoms);
			generateReceipt(firstName, dob, phone, visitReason, specialty, doctor, nurse, symptoms);

			showToast("✓ Bemor muvaffaqiyatli ro'yxatga olingan!", 'success');
			document.getElementById('receiptSection').scrollIntoView({ behavior: 'smooth' });
		} catch (error) {
			console.error('Error:', error);
			showToast('Xato yuz berdi', 'error');
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
			surgery: '🏥 Jarrohlik',
			emergency: '🚨 Shoshqoqlik',
		};

		let html = `
                    <div class="info-section">
                        <div class="info-label">Bemor Ismi</div>
                        <div class="info-value">${name}</div>
                    </div>
                    <div class="info-section">
                        <div class="info-label">Yosh</div>
                        <div class="info-value">${age} yosh</div>
                    </div>
                    <div class="info-section">
                        <div class="info-label">Telefon</div>
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
                        <div class="info-label">Doktor</div>
                        <div class="doctor-card">
                            <div class="doctor-name">👨‍⚕️ ${doctor.name}</div>
                            <div class="doctor-specialty">${doctor.specialty}</div>
                        </div>
                    </div>
                    <div class="info-section">
                        <div class="info-label">Shifkor</div>
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
		showToast('Xato yuz berdi', 'error');
	}
}

function generateReceipt(name, dob, phone, reason, specialty, doctor, nurse, symptoms) {
	try {
		const receiptNum = 'CHK-' + Date.now().toString().slice(-8);
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
                    <div class="receipt-header">🏥 MEDICLINIC PRO</div>
                    <div style="font-size: 10px; margin-bottom: 15px; opacity: 0.7; letter-spacing: 2px;">BEMORNI RO'YXATGA OLISH CHEKI</div>

                    <div style="border-top: 2px dashed #FF006E; border-bottom: 2px dashed #FF006E; padding: 12px 0; margin: 12px 0;">
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

                    <div style="border-top: 2px dashed #FF006E; border-bottom: 2px dashed #FF006E; padding: 12px 0; margin: 12px 0;">
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
                        ✓ Bemor ro'yxatga olingan<br>
                        ✓ Doktorga yuborilgan<br>
                        Chekni saqlab qoling
                    </div>
                `;

		document.getElementById('receiptContent').innerHTML = html;
		document.getElementById('receiptSection').classList.add('active');
	} catch (error) {
		console.error('Receipt error:', error);
		showToast('Chekni yaratishda xato', 'error');
	}
}

function printReceipt() {
	try {
		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			showToast('Yangi oyna ochishga ruxsat berilmagan', 'error');
			return;
		}
		const content = document.getElementById('receiptContent').innerHTML;
		printWindow.document.write(
			`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Chek</title><style>body{font-family:'Courier New',monospace;padding:20px;background:white}*{margin:0;padding:0}</style></head><body><div style="border:2px dashed #FF006E;padding:20px;text-align:center;max-width:400px;margin:0 auto">${content}</div></body></html>`,
		);
		printWindow.document.close();
		setTimeout(() => printWindow.print(), 500);
		showToast('Chap qilish dialogi ochildi', 'success');
	} catch (error) {
		showToast('Xato yuz berdi', 'error');
	}
}

function downloadReceipt() {
	try {
		const text = document.getElementById('receiptContent').innerText;
		const link = document.createElement('a');
		link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
		link.download = `chek_${Date.now()}.txt`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		showToast('Chek saqlandi ✓', 'success');
	} catch (error) {
		showToast('Saqlashda xato', 'error');
	}
}

function openEmailModal() {
	if (!currentPatientData) {
		showToast("Avval bemorni ro'yxatga oling", 'warning');
		return;
	}
	document.getElementById('emailModal').classList.add('active');
	document.getElementById('emailInput').focus();
}

function closeEmailModal() {
	document.getElementById('emailModal').classList.remove('active');
}

function sendEmail() {
	const email = document.getElementById('emailInput').value?.trim() || '';
	if (!email) {
		showToast('Email kiriting', 'warning');
		return;
	}
	if (!validateEmail(email)) {
		showToast("Noto'g'ri email", 'error');
		return;
	}
	const btn = event.target;
	btn.disabled = true;
	btn.innerHTML = 'Yuborilmoqda...';
	setTimeout(() => {
		showToast('📧 Chek ' + email + ' ga yuborildi!', 'success');
		closeEmailModal();
		btn.disabled = false;
		btn.innerHTML = 'Yuborish';
	}, 1500);
}

function newPatient() {
	if (confirm('Formani tozalamoqchimisiz?')) {
		document.getElementById('patientForm').reset();
		document.getElementById('receiptSection').classList.remove('active');
		document.getElementById('patientInfo').innerHTML = '<div class="empty-state">👈 Forma orqali ma\'lumot kiriting</div>';
		document.getElementById('doctor').innerHTML = '<option value="">-- Mutaxassislikni birinchi tanlang --</option>';
		clearErrors();
		currentPatientData = null;
		showToast('✓ Form tozalandi', 'success');
	}
}

document.addEventListener('keypress', function (event) {
	if (event.key === 'Enter') {
		const activeElement = document.activeElement;
		if (activeElement.id === 'emailInput') sendEmail();
		else if (activeElement.closest('#patientForm')) registerPatient();
	}
});

window.addEventListener('click', function (event) {
	const modal = document.getElementById('emailModal');
	if (event.target === modal) closeEmailModal();
});
