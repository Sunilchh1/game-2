/* script.js */

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('section');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            sections.forEach(section => section.classList.remove('active'));
            document.querySelector(link.getAttribute('href')).classList.add('active');
        });
    });

    sections[0].classList.add('active');

    // User data management
    const userList = document.getElementById('user-list');
    let users = [];

    async function fetchUsers() {
        const response = await fetch('http://localhost:3000/api/users');
        users = await response.json();
        displayUsers();
    }

    function displayUsers() {
        userList.innerHTML = '';
        users.forEach((user, index) => {
            userList.innerHTML += `
                <tr>
                    <td>${user.username}</td>
                    <td>
                        <button onclick="generateOTP(${index})">Generate OTP</button>
                        <div id="otp-display-${index}"></div>
                        <button onclick="deleteUser('${user._id}', ${index})">Delete</button>
                    </td>
                </tr>`;
        });
    }

    const createAccountForm = document.getElementById('create-account-form');
    createAccountForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username && password) {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const newUser = await response.json();
            users.push(newUser);
            displayUsers();
            createAccountForm.reset();
        } else {
            alert('Please fill out all fields');
        }
    });

    window.deleteUser = async function(id, index) {
        await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE'
        });
        users.splice(index, 1);
        displayUsers();
    }

    // OTP Management
    let otpTimeouts = [];

    window.generateOTP = function(index) {
        if (otpTimeouts[index]) {
            clearTimeout(otpTimeouts[index]);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpDisplay = document.getElementById(`otp-display-${index}`);
        otpDisplay.textContent = `Your OTP is: ${otp}`;

        otpTimeouts[index] = setTimeout(() => {
            otpDisplay.textContent = 'Your OTP has expired.';
        }, 300000); // OTP expires in 5 minutes (300000 ms)
    }

    // Fetch users on load
    fetchUsers();

    // Transaction data management
    const transactionList = document.getElementById('transaction-list');
    const transactions = [
        { id: 1, amount: 100, date: '2024-06-19', customerId: 'C001' },
        { id: 2, amount: 200, date: '2024-06-20', customerId: 'C002' }
    ];

    function displayTransactions(filteredTransactions) {
        transactionList.innerHTML = '';
        filteredTransactions.forEach(transaction => {
            transactionList.innerHTML += `<div>ID: ${transaction.id}, Amount: $${transaction.amount}, Date: ${transaction.date}, Customer ID: ${transaction.customerId}</div>`;
        });
    }

    displayTransactions(transactions);

    window.searchTransactions = function() {
        const customerId = document.getElementById('customer-id').value;
        const filteredTransactions = transactions.filter(transaction => transaction.customerId === customerId);
        displayTransactions(filteredTransactions);
    }

    // Game records management
    const gameList = document.getElementById('game-list');
    const games = [
        { id: 1, name: 'Game 1', score: 95 },
        { id: 2, name: 'Game 2', score: 88 }
    ];

    games.forEach(game => {
        gameList.innerHTML += `<div>ID: ${game.id}, Name: ${game.name}, Score: ${game.score}</div>`;
    });

    // Account actions
    window.resetAccount = function() {
        // Example action: Reset account logic
        alert('Account reset successfully.');
        // Implement actual account reset logic here
    }

    window.rechargePoints = function() {
        const points = parseInt(document.getElementById('points').value);
        if (!isNaN(points) && points > 0) {
            alert(`Recharged ${points} points successfully.`);
            // Implement actual points recharge logic here
        } else {
            alert('Please enter a valid number of points.');
        }
    }

    window.redeemPoints = function() {
        const redeemPoints = parseInt(document.getElementById('redeem-points').value);
        if (!isNaN(redeemPoints) && redeemPoints > 0) {
            alert(`Redeemed ${redeemPoints} points successfully.`);
            // Implement actual points redeem logic here
        } else {
            alert('Please enter a valid number of points to redeem.');
        }
    }

    // Logout functionality
    window.logout = function() {
        alert('Logged out');
        window.location.href = 'index.html'; // Redirect to the login page
    }
});
