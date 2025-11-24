// ============================================
// IN-MEMORY STORAGE (thay thế localStorage)
// ============================================
const inMemoryStorage = {
    data: {},
    setItem(key, value) {
        this.data[key] = value;
    },
    getItem(key) {
        return this.data[key] || null;
    },
    removeItem(key) {
        delete this.data[key];
    },
    clear() {
        this.data = {};
    }
};

// ============================================
// BAITAP 01: DANH SÁCH SẢN PHẨM
// ============================================
const products = [
    { 
        id: 1, 
        name: 'Laptop Dell XPS 13', 
        price: 25000000, 
        category: 'Laptop', 
        description: 'Laptop cao cấp, màn hình 13 inch',
        image: 'images/products/laptop-dell-xps-13.jpg'
    },
    { 
        id: 2, 
        name: 'iPhone 15 Pro Max', 
        price: 35000000, 
        category: 'Điện thoại', 
        description: 'Smartphone flagship của Apple',
        image: 'images/products/iphone-15-pro-max.jpg'
    },
    { 
        id: 3, 
        name: 'Samsung Galaxy S24 Ultra', 
        price: 32000000, 
        category: 'Điện thoại', 
        description: 'Android flagship tốt nhất',
        image: 'images/products/samsung-galaxy-s24.jpg'
    },
    { 
        id: 4, 
        name: 'MacBook Pro M3', 
        price: 45000000, 
        category: 'Laptop', 
        description: 'Laptop cho chuyên gia sáng tạo',
        image: 'images/products/macbook-pro-m3.jpg'
    },
    { 
        id: 5, 
        name: 'iPad Pro 12.9', 
        price: 28000000, 
        category: 'Tablet', 
        description: 'Máy tính bảng cao cấp',
        image: 'images/products/ipad-pro-129.jpg'
    },
    { 
        id: 6, 
        name: 'Sony WH-1000XM5', 
        price: 8500000, 
        category: 'Tai nghe', 
        description: 'Tai nghe chống ồn tốt nhất',
        image: 'images/products/sony-wh-1000xm5.jpg'
    },
    { 
        id: 7, 
        name: 'AirPods Pro 2', 
        price: 6500000, 
        category: 'Tai nghe', 
        description: 'Tai nghe true wireless của Apple',
        image: 'images/products/airpods-pro-2.jpg'
    },
    { 
        id: 8, 
        name: 'Samsung Odyssey G9', 
        price: 35000000, 
        category: 'Màn hình', 
        description: 'Màn hình gaming cong 49 inch',
        image: 'images/products/samsung-odyssey-g9.jpg'
    }
];

// Sanitize input để tránh XSS
function sanitizeInput(input) {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
}

// Validate search input
function validateSearchInput(input) {
    if (!input || input.trim().length === 0) {
        return { valid: false, message: 'Vui lòng nhập từ khóa tìm kiếm!' };
    }
    
    if (input.length > 50) {
        return { valid: false, message: 'Từ khóa quá dài (tối đa 50 ký tự)!' };
    }
    
    // Chỉ cho phép chữ cái, số, khoảng trắng
    const validPattern = /^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$/;
    
    if (!validPattern.test(input)) {
        return { valid: false, message: 'Từ khóa chứa ký tự không hợp lệ!' };
    }
    
    return { valid: true, message: '' };
}

// Render sản phẩm
function renderProducts(productList) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    if (productList.length === 0) {
        container.innerHTML = '<p class="no-results">Không tìm thấy sản phẩm nào!</p>';
        return;
    }
    
    container.innerHTML = productList.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" 
                     alt="${sanitizeInput(product.name)}" 
                     loading="lazy"
                     onerror="this.src='images/products/placeholder.jpg'">
            </div>
            <div class="product-info">
                <h3>${sanitizeInput(product.name)}</h3>
                <p class="product-description">${sanitizeInput(product.description)}</p>
                <p class="product-price">${product.price.toLocaleString('vi-VN')}đ</p>
                <span class="product-category">${sanitizeInput(product.category)}</span>
            </div>
        </div>
    `).join('');
}

// Tìm kiếm sản phẩm
function searchProducts(keyword) {
    const sanitized = sanitizeInput(keyword.trim());
    const lowerKeyword = sanitized.toLowerCase();
    
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerKeyword) ||
        product.category.toLowerCase().includes(lowerKeyword) ||
        product.description.toLowerCase().includes(lowerKeyword)
    );
}

// Init Baitap 01
function initBaitap01() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!searchInput) return;
    
    // Hiển thị tất cả sản phẩm ban đầu
    renderProducts(products);
    
    // Xử lý tìm kiếm
    const handleSearch = () => {
        const keyword = searchInput.value;
        const validation = validateSearchInput(keyword);
        
        if (!validation.valid) {
            errorMessage.textContent = validation.message;
            errorMessage.classList.add('show');
            return;
        }
        
        errorMessage.classList.remove('show');
        const results = searchProducts(keyword);
        renderProducts(results);
        
        if (results.length === 0) {
            errorMessage.textContent = `Không tìm thấy sản phẩm với từ khóa "${sanitizeInput(keyword)}"`;
            errorMessage.classList.add('show');
        }
    };
    
    searchBtn.addEventListener('click', handleSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        errorMessage.classList.remove('show');
        renderProducts(products);
    });
}

// ============================================
// BAITAP 02: FORM ĐĂNG KÝ
// ============================================

// Validate email
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Validate mật khẩu
function validatePassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return {
        valid: hasUpperCase && hasLowerCase && hasNumber && isLongEnough,
        errors: {
            length: !isLongEnough,
            uppercase: !hasUpperCase,
            lowercase: !hasLowerCase,
            number: !hasNumber
        }
    };
}

// Lưu user vào storage (mã hóa mật khẩu đơn giản)
function saveUser(userData) {
    try {
        const users = JSON.parse(inMemoryStorage.getItem('users') || '[]');
        
        // Mã hóa mật khẩu đơn giản (trong thực tế nên dùng bcrypt)
        const encodedPassword = btoa(userData.password);
        
        const newUser = {
            id: Date.now(),
            name: sanitizeInput(userData.name),
            email: sanitizeInput(userData.email),
            password: encodedPassword,
            registeredAt: new Date().toISOString()
        };
        
        users.push(newUser);
        inMemoryStorage.setItem('users', JSON.stringify(users));
        
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error);
        return false;
    }
}

// Hiển thị danh sách users đã đăng ký
function displayRegisteredUsers() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    try {
        const users = JSON.parse(inMemoryStorage.getItem('users') || '[]');
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>Chưa có người dùng nào đăng ký.</p>';
            return;
        }
        
        usersList.innerHTML = users.map(user => `
            <div class="user-item">
                <strong>${user.name}</strong><br>
                Email: ${user.email}<br>
                Đăng ký: ${new Date(user.registeredAt).toLocaleString('vi-VN')}
            </div>
        `).join('');
    } catch (error) {
        usersList.innerHTML = '<p>Lỗi khi tải dữ liệu người dùng.</p>';
    }
}

// Init Baitap 02
function initBaitap02() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const passwordInput = document.getElementById('userPassword');
    const agreeTerms = document.getElementById('agreeTerms');
    const togglePassword = document.getElementById('togglePassword');
    const clearForm = document.getElementById('clearForm');
    const clearStorage = document.getElementById('clearStorage');
    
    // Hiển thị users đã đăng ký
    displayRegisteredUsers();
    
    // Toggle hiện/ẩn mật khẩu
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
    
    // Clear form
    clearForm.addEventListener('click', () => {
        form.reset();
        document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
    });
    
    // Clear storage
    clearStorage.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu người dùng?')) {
            inMemoryStorage.removeItem('users');
            displayRegisteredUsers();
            alert('Đã xóa tất cả dữ liệu!');
        }
    });
    
    // Validate form khi submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
        
        // Validate name
        if (nameInput.value.trim().length < 2) {
            document.getElementById('nameError').textContent = 'Tên phải có ít nhất 2 ký tự';
            isValid = false;
        }
        
        // Validate email
        if (!validateEmail(emailInput.value)) {
            document.getElementById('emailError').textContent = 'Email không hợp lệ';
            isValid = false;
        }
        
        // Validate password
        const passwordValidation = validatePassword(passwordInput.value);
        if (!passwordValidation.valid) {
            let errorMsg = 'Mật khẩu phải có: ';
            const errors = [];
            if (passwordValidation.errors.length) errors.push('ít nhất 8 ký tự');
            if (passwordValidation.errors.uppercase) errors.push('chữ hoa');
            if (passwordValidation.errors.lowercase) errors.push('chữ thường');
            if (passwordValidation.errors.number) errors.push('số');
            
            document.getElementById('passwordError').textContent = errorMsg + errors.join(', ');
            isValid = false;
        }
        
        // Validate terms
        if (!agreeTerms.checked) {
            document.getElementById('termsError').textContent = 'Bạn phải đồng ý với điều khoản';
            isValid = false;
        }
        
        if (isValid) {
            const userData = {
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            };
            
            if (saveUser(userData)) {
                const successMessage = document.getElementById('successMessage');
                successMessage.textContent = '✅ Đăng ký thành công! Dữ liệu đã được lưu vào bộ nhớ.';
                successMessage.classList.add('show');
                
                form.reset();
                displayRegisteredUsers();
                
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            } else {
                alert('Có lỗi xảy ra khi lưu dữ liệu!');
            }
        }
    });
}

// ============================================
// BAITAP 03: ĐỒNG HỒ ĐẾM NGƯỢC
// ============================================
let timerInterval = null;
let timeRemaining = 600; // 10 phút = 600 giây
let isRunning = false;

// Format thời gian MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update hiển thị
function updateDisplay() {
    const display = document.getElementById('timerDisplay');
    if (!display) return;
    
    display.textContent = formatTime(timeRemaining);
    
    // Thêm warning class khi < 1 phút
    if (timeRemaining < 60) {
        display.classList.add('warning');
    } else {
        display.classList.remove('warning');
    }
}

// Start timer
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('timerStatus').textContent = 'Đang chạy...';
    
    // Clear interval cũ nếu có (tránh memory leak)
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateDisplay();
        } else {
            stopTimer();
            showModal();
        }
    }, 1000);
}

// Pause timer
function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('timerStatus').textContent = 'Đã tạm dừng';
}

// Stop timer
function stopTimer() {
    isRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('timerStatus').textContent = 'Đã kết thúc';
}

// Reset timer
function resetTimer() {
    stopTimer();
    timeRemaining = 600;
    updateDisplay();
    document.getElementById('timerStatus').textContent = 'Sẵn sàng';
}

// Show modal
function showModal() {
    const modal = document.getElementById('timerModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Hide modal
function hideModal() {
    const modal = document.getElementById('timerModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Init Baitap 03
function initBaitap03() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modal = document.getElementById('timerModal');
    const modalClose = document.querySelector('.modal-close');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    if (!startBtn) return;
    
    updateDisplay();
    
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Modal controls
    if (modalClose) modalClose.addEventListener('click', hideModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
    
    // Click outside modal to close
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            hideModal();
        }
    });
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        
        const successDiv = document.getElementById('contactSuccess');
        successDiv.textContent = `Cảm ơn ${sanitizeInput(name)}! Tin nhắn của bạn đã được gửi thành công.`;
        successDiv.classList.add('show');
        
        contactForm.reset();
        
        setTimeout(() => {
            successDiv.classList.remove('show');
        }, 5000);
    });
}

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initBaitap01();
    initBaitap02();
    initBaitap03();
    initContactForm();
});

// Cleanup khi trang unload (tránh memory leak)
window.addEventListener('beforeunload', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});