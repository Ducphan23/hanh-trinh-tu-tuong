// ============================================
// GAME LOGIC - HÀNH TRÌNH TƯ TƯỞNG
// ============================================

class Game {
    constructor() {
        // Game State
        this.playerName = '';
        this.currentRound = 1;
        this.currentQuestion = 0;
        this.totalQuestions = { round1: 15, round2: 15 };
        
        // Score System
        this.score = {
            round1: 0,
            round2: 0,
            bonus: 0,
            total: 0
        };
        this.round1BaseScore = 10; // Điểm cơ bản mỗi câu vòng 1
        this.round1CorrectAnswers = 0; // Đếm số câu đúng vòng 1
        
        // Round 2 specific
        this.correctStreak = 0;
        this.haloLevel = 0;
        this.stars = 5;
        this.usingStarThisQuestion = false;
        this.currentQuestionPoints = 10;
        
        // Items & Equipment
        this.inventory = [];
        this.equippedItems = {};
        this.dropRateBonus = 0;
        this.guaranteedDrops = 3;
        this.itemsDropped = 0;
        
        // Second Chance (Áo Dài)
        this.hasSecondChance = false;
        this.usedSecondChance = false;
        
        // Gamble (Áo Tứ Thân)
        this.hasGamble = false;
        this.gambleResult = null; // 'win' hoặc 'lose'
        
        // Questions
        this.questions = {
            round1: this.shuffleArray([...QUESTIONS.round1]),
            round2: this.shuffleArray([...QUESTIONS.round2])
        };
        
        // Leaderboard
        this.leaderboard = this.loadLeaderboard();
        
        // Initialize
        this.initEventListeners();
        this.updateLeaderboardDisplay();
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    loadLeaderboard() {
        const saved = localStorage.getItem('hanhTrinhTuTuong_leaderboard');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveLeaderboard() {
        localStorage.setItem('hanhTrinhTuTuong_leaderboard', JSON.stringify(this.leaderboard));
    }
    
    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    initEventListeners() {
        // Start Screen
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('leaderboard-btn').addEventListener('click', () => this.toggleLeaderboard());
        document.getElementById('close-leaderboard').addEventListener('click', () => this.toggleLeaderboard());
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });
        
        // Answer Buttons - Round 1
        document.querySelectorAll('#r1-answers .answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(e.currentTarget.dataset.answer));
        });
        
        // Answer Buttons - Round 2
        document.querySelectorAll('#r2-answers .answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(e.currentTarget.dataset.answer));
        });
        
        // Next Button - Round 1
        document.getElementById('r1-next-btn').addEventListener('click', () => this.nextQuestion());
        
        // Next Button - Round 2
        document.getElementById('r2-next-btn').addEventListener('click', () => this.nextQuestion());
        
        // Item Popup
        document.getElementById('equip-item-btn').addEventListener('click', () => this.equipItem(true));
        document.getElementById('skip-item-btn').addEventListener('click', () => this.equipItem(false));
        
        // Round Transition
        document.getElementById('start-round2-btn').addEventListener('click', () => this.startRound2());
        
        // Star buttons
        document.getElementById('use-star-btn').addEventListener('click', () => this.useStar(true));
        document.getElementById('skip-star-btn').addEventListener('click', () => this.useStar(false));
        
        // Gamble
        const rollDiceBtn = document.getElementById('roll-dice-btn');
        if (rollDiceBtn) {
            rollDiceBtn.addEventListener('click', () => this.rollDice());
        }
        
        // Second Chance - Round 1
        document.getElementById('r1-retry-btn').addEventListener('click', () => this.retryQuestion());
        
        // Second Chance - Round 2
        document.getElementById('r2-retry-btn').addEventListener('click', () => this.retryQuestion());
        
        // End Screen
        document.getElementById('play-again-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('view-leaderboard-btn').addEventListener('click', () => this.toggleEndLeaderboard());
        document.getElementById('close-end-leaderboard').addEventListener('click', () => this.toggleEndLeaderboard());
    }
    
    toggleLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        modal.classList.toggle('hidden');
    }
    
    toggleEndLeaderboard() {
        const modal = document.getElementById('end-leaderboard-modal');
        modal.classList.toggle('hidden');
    }
    
    // ============================================
    // SCREEN MANAGEMENT
    // ============================================
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }
    
    showPopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) popup.classList.remove('hidden');
    }
    
    hidePopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) popup.classList.add('hidden');
    }
    
    // ============================================
    // GAME FLOW
    // ============================================
    
    startGame() {
        const nameInput = document.getElementById('player-name');
        this.playerName = nameInput.value.trim() || 'Người chơi';
        
        this.showScreen('round1-screen');
        this.loadQuestion();
        this.updateUI();
    }
    
    loadQuestion() {
        const questions = this.currentRound === 1 ? this.questions.round1 : this.questions.round2;
        const question = questions[this.currentQuestion];
        
        if (!question) {
            if (this.currentRound === 1) {
                this.endRound1();
            } else {
                this.endRound2();
            }
            return;
        }
        
        // Reset state
        this.usedSecondChance = false;
        this.usingStarThisQuestion = false;
        
        // Calculate points for this question
        if (this.currentRound === 1) {
            this.currentQuestionPoints = this.round1BaseScore;
        } else {
            // Round 2: Random 5-20 điểm
            this.currentQuestionPoints = Math.floor(Math.random() * 16) + 5;
        }
        
        // Get current round prefix
        const prefix = this.currentRound === 1 ? 'r1' : 'r2';
        
        // Update question display
        document.getElementById(`${prefix}-question-text`).textContent = question.question;
        document.getElementById(`${prefix}-question-number`).textContent = `Câu ${this.currentQuestion + 1}`;
        
        // Update points display
        if (this.currentRound === 1) {
            document.getElementById(`${prefix}-question-points`).innerHTML = 
                `<span class="points-value">+${this.currentQuestionPoints}</span><span class="points-label">điểm</span>`;
        } else {
            document.getElementById(`${prefix}-points-value`).textContent = `+${this.currentQuestionPoints}`;
        }
        
        // Update answers
        const answerBtns = document.querySelectorAll(`#${prefix}-answers .answer-btn`);
        answerBtns.forEach(btn => {
            const answer = btn.dataset.answer;
            btn.querySelector('.answer-text').textContent = question.answers[answer];
            btn.classList.remove('selected', 'correct', 'wrong');
            btn.disabled = false;
        });
        
        // Hide feedback and next button, reset next button text
        document.getElementById(`${prefix}-feedback`).classList.add('hidden');
        const nextBtn = document.getElementById(`${prefix}-next-btn`);
        nextBtn.classList.add('hidden');
        nextBtn.innerHTML = 'Câu tiếp theo <span class="btn-arrow">→</span>';
        
        // Star prompt for Round 2
        if (this.currentRound === 2 && this.stars > 0) {
            // 40% chance to show star option
            if (Math.random() < 0.4) {
                document.getElementById('r2-star-prompt').classList.remove('hidden');
            } else {
                document.getElementById('r2-star-prompt').classList.add('hidden');
            }
        }
        
        this.updateUI();
    }
    
    useStar(use) {
        document.getElementById('r2-star-prompt').classList.add('hidden');
        if (use && this.stars > 0) {
            this.stars--;
            this.usingStarThisQuestion = true;
            this.currentQuestionPoints *= 2;
            document.getElementById('r2-points-value').textContent = `+${this.currentQuestionPoints} ⭐x2`;
            document.getElementById('r2-star-count').textContent = this.stars;
        }
    }
    
    selectAnswer(answer) {
        const questions = this.currentRound === 1 ? this.questions.round1 : this.questions.round2;
        const question = questions[this.currentQuestion];
        const isCorrect = answer === question.correct;
        const prefix = this.currentRound === 1 ? 'r1' : 'r2';
        
        // Disable all buttons
        document.querySelectorAll(`#${prefix}-answers .answer-btn`).forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === question.correct) {
                btn.classList.add('correct');
            } else if (btn.dataset.answer === answer && !isCorrect) {
                btn.classList.add('wrong');
            }
        });
        
        // Show feedback
        const feedback = document.getElementById(`${prefix}-feedback`);
        feedback.classList.remove('hidden', 'correct', 'wrong');
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer(answer);
        }
    }
    handleCorrectAnswer() {
        const prefix = this.currentRound === 1 ? 'r1' : 'r2';
        const feedback = document.getElementById(`${prefix}-feedback`);
        feedback.classList.add('correct');
        feedback.innerHTML = `<span class="feedback-icon">🎉</span><span class="feedback-text">Chính xác! +${this.currentQuestionPoints} điểm</span>`;
        
        // Add score
        if (this.currentRound === 1) {
            this.score.round1 += this.currentQuestionPoints;
            this.round1CorrectAnswers++;
        } else {
            this.score.round2 += this.currentQuestionPoints;
            this.correctStreak++;
            
            // Check halo
            if (this.correctStreak % 3 === 0) {
                this.haloLevel++;
                this.updateHalo();
                feedback.innerHTML += ` ✨ Hào quang cấp ${this.haloLevel}!`;
                
                // Show notification
                const notification = document.getElementById('halo-notification');
                document.getElementById('halo-level').textContent = this.haloLevel;
                notification.classList.remove('hidden');
                setTimeout(() => notification.classList.add('hidden'), 3000);
            }
            
            // Update streak display
            document.getElementById('r2-streak-count').textContent = this.correctStreak;
            document.getElementById('streak-display').textContent = this.correctStreak;
            const remaining = 3 - (this.correctStreak % 3);
            document.getElementById('streak-remaining').textContent = remaining;
            const streakProgress = ((this.correctStreak % 3) / 3) * 100;
            document.getElementById('streak-progress-fill').style.width = `${streakProgress}%`;
        }
        
        // Check item drop (Round 1 only)
        if (this.currentRound === 1) {
            this.checkItemDrop();
        }
        
        this.updateUI();
        
        // Check if this is the last question
        const questions = this.currentRound === 1 ? this.questions.round1 : this.questions.round2;
        const isLastQuestion = this.currentQuestion >= questions.length - 1;
        
        if (isLastQuestion) {
            // Auto advance after delay for last question
            const nextBtn = document.getElementById(`${prefix}-next-btn`);
            nextBtn.textContent = this.currentRound === 1 ? 'Tiếp tục Vòng 2 →' : 'Xem kết quả →';
            nextBtn.classList.remove('hidden');
            
            // Auto advance after 2 seconds
            setTimeout(() => {
                this.nextQuestion();
            }, 2000);
        } else {
            document.getElementById(`${prefix}-next-btn`).classList.remove('hidden');
        }
    }
    
    handleWrongAnswer(selectedAnswer) {
        const prefix = this.currentRound === 1 ? 'r1' : 'r2';
        const feedback = document.getElementById(`${prefix}-feedback`);
        
        // Check for Áo Dài second chance
        if (this.hasSecondChance && !this.usedSecondChance) {
            const roll = Math.random() * 100;
            if (roll <= 33) {
                this.usedSecondChance = true;
                feedback.classList.add('wrong');
                feedback.innerHTML = '<span class="feedback-icon">❌</span><span class="feedback-text">Sai rồi...nhưng khoan!</span>';
                
                // Re-enable buttons except the wrong one
                setTimeout(() => {
                    this.showPopup(`${prefix}-second-chance-popup`);
                }, 500);
                return;
            }
        }
        
        // Wrong answer - no second chance
        feedback.classList.add('wrong');
        const questions = this.currentRound === 1 ? this.questions.round1 : this.questions.round2;
        const question = questions[this.currentQuestion];
        feedback.innerHTML = `<span class="feedback-icon">❌</span><span class="feedback-text">Sai rồi! Đáp án đúng là: ${question.correct}</span>`;
        
        // Reset streak in Round 2
        if (this.currentRound === 2) {
            this.correctStreak = 0;
            document.getElementById('r2-streak-count').textContent = 0;
            document.getElementById('streak-display').textContent = 0;
            document.getElementById('streak-remaining').textContent = 3;
            document.getElementById('streak-progress-fill').style.width = '0%';
        }
        
        // Check if this is the last question
        const isLastQuestion = this.currentQuestion >= questions.length - 1;
        
        if (isLastQuestion) {
            // Auto advance after delay for last question
            const nextBtn = document.getElementById(`${prefix}-next-btn`);
            nextBtn.textContent = this.currentRound === 1 ? 'Tiếp tục Vòng 2 →' : 'Xem kết quả →';
            nextBtn.classList.remove('hidden');
            
            // Auto advance after 2 seconds
            setTimeout(() => {
                this.nextQuestion();
            }, 2000);
        } else {
            document.getElementById(`${prefix}-next-btn`).classList.remove('hidden');
        }
    }
    
    retryQuestion() {
        const prefix = this.currentRound === 1 ? 'r1' : 'r2';
        this.hidePopup(`${prefix}-second-chance-popup`);
        
        // Re-enable buttons except already selected
        document.querySelectorAll(`#${prefix}-answers .answer-btn`).forEach(btn => {
            if (!btn.classList.contains('wrong')) {
                btn.disabled = false;
                btn.classList.remove('correct');
            }
        });
        
        const feedback = document.getElementById(`${prefix}-feedback`);
        feedback.innerHTML = '<span class="feedback-icon">👘</span><span class="feedback-text">Áo Dài hộ mệnh! Chọn lại đáp án khác!</span>';
        feedback.classList.remove('wrong');
        feedback.classList.add('correct');
    }
    
    nextQuestion() {
        this.currentQuestion++;
        this.loadQuestion();
    }
    
    // ============================================
    // ITEM SYSTEM
    // ============================================
    
    checkItemDrop() {
        const droppedItemId = calculateItemDrop(
            this.inventory,
            this.dropRateBonus,
            this.guaranteedDrops,
            this.currentQuestion + 1,
            this.totalQuestions.round1
        );
        
        if (droppedItemId) {
            this.showItemDrop(droppedItemId);
        }
    }
    
    showItemDrop(itemId) {
        const item = ITEMS[itemId];
        this.pendingItem = itemId;
        
        document.getElementById('item-icon').textContent = item.icon;
        document.getElementById('item-name').textContent = item.name;
        document.getElementById('item-description').textContent = item.description;
        
        this.showPopup('item-popup');
    }
    
    equipItem(equip) {
        const itemId = this.pendingItem;
        const item = ITEMS[itemId];
        
        if (equip) {
            // Nếu đã có item cùng slot, xóa item cũ và hủy effect
            if (this.equippedItems[item.slot]) {
                const oldItemId = this.equippedItems[item.slot];
                const oldItem = ITEMS[oldItemId];
                
                // Xóa item cũ khỏi inventory
                const oldIndex = this.inventory.indexOf(oldItemId);
                if (oldIndex > -1) {
                    this.inventory.splice(oldIndex, 1);
                }
                
                // Hủy effect của item cũ
                this.removeItemEffect(oldItem);
            }
            
            // Thêm item mới vào inventory và equip
            this.inventory.push(itemId);
            this.equippedItems[item.slot] = itemId;
            this.applyItemEffect(item);
            this.updateCharacterEquipment();
        } else {
            // Không equip, chỉ thêm vào inventory
            this.inventory.push(itemId);
        }
        
        this.itemsDropped++;
        this.updateInventoryDisplay();
        this.hidePopup('item-popup');
        this.pendingItem = null;
    }
    
    removeItemEffect(item) {
        if (!item || !item.effect) return;
        
        switch (item.effect.type) {
            case 'BONUS_SCORE':
                this.score.bonus -= item.effect.value;
                break;
                
            case 'INCREASE_DROP_RATE':
                this.dropRateBonus -= item.effect.value;
                break;
                
            case 'SECOND_CHANCE':
                this.hasSecondChance = false;
                break;
                
            case 'DOUBLE_ROUND1_SCORE':
                // Trả về điểm cơ bản ban đầu
                this.round1BaseScore = 10;
                this.score.round1 = this.round1CorrectAnswers * this.round1BaseScore;
                this.currentQuestionPoints = this.round1BaseScore;
                const prefix = this.currentRound === 1 ? 'r1' : 'r2';
                document.getElementById(`${prefix}-question-points`).innerHTML = 
                    `<span class="points-value">+${this.currentQuestionPoints}</span><span class="points-label">điểm</span>`;
                break;
                
            case 'GAMBLE':
                this.hasGamble = false;
                break;
                
            // MULTIPLY_TOTAL không cần xử lý vì chỉ áp dụng ở cuối game
        }
    }
    
    applyItemEffect(item) {
        switch (item.effect.type) {
            case 'BONUS_SCORE':
                this.score.bonus += item.effect.value;
                break;
                
            case 'MULTIPLY_TOTAL':
                // Applied at end game
                break;
                
            case 'INCREASE_DROP_RATE':
                this.dropRateBonus += item.effect.value;
                break;
                
            case 'SECOND_CHANCE':
                this.hasSecondChance = true;
                break;
                
            case 'DOUBLE_ROUND1_SCORE':
                // Recalculate all Round 1 scores
                const oldScore = this.round1BaseScore;
                this.round1BaseScore = item.effect.value;
                // Recalculate previous correct answers
                this.score.round1 = this.round1CorrectAnswers * this.round1BaseScore;
                this.currentQuestionPoints = this.round1BaseScore;
                const prefix = this.currentRound === 1 ? 'r1' : 'r2';
                document.getElementById(`${prefix}-question-points`).innerHTML = 
                    `<span class="points-value">+${this.currentQuestionPoints}</span><span class="points-label">điểm</span>`;
                break;
                
            case 'GAMBLE':
                this.hasGamble = true;
                break;
        }
        
        this.updateUI();
    }
    
    updateCharacterEquipment() {
        // Update for both rounds and end screen
        const rounds = ['r1', 'r2', 'end'];
        
        rounds.forEach(prefix => {
            // Reset all equipment visuals
            document.querySelectorAll(`#${prefix}-equip-hat, #${prefix}-equip-top, #${prefix}-equip-bottom, #${prefix}-equip-shoes, #${prefix}-equip-vehicle`).forEach(el => {
                if (el) {
                    el.classList.remove('active');
                    el.style.backgroundImage = '';
                    el.textContent = '';
                }
            });
            
            // Apply equipped items
            for (const [slot, itemId] of Object.entries(this.equippedItems)) {
                const item = ITEMS[itemId];
                const equipEl = document.getElementById(`${prefix}-equip-${slot}`);
                if (equipEl) {
                    equipEl.classList.add('active');
                    equipEl.textContent = item.icon;
                    equipEl.style.fontSize = '40px';
                    equipEl.style.display = 'flex';
                    equipEl.style.justifyContent = 'center';
                    equipEl.style.alignItems = 'center';
                }
            }
        });
    }
    
    updateInventoryDisplay() {
        const lists = ['r1-inventory-list', 'r2-inventory-list'];
        
        lists.forEach(listId => {
            const list = document.getElementById(listId);
            if (!list) return;
            
            list.innerHTML = '';
            
            if (this.inventory.length === 0) {
                list.innerHTML = '<span class="empty-inventory">Chưa có trang bị nào</span>';
                return;
            }
            
            this.inventory.forEach(itemId => {
                const item = ITEMS[itemId];
                const isEquipped = Object.values(this.equippedItems).includes(itemId);
                const div = document.createElement('div');
                div.className = 'inventory-item' + (isEquipped ? ' equipped' : '');
                div.innerHTML = `${item.icon} ${item.name} ${isEquipped ? '✓' : ''}`;
                list.appendChild(div);
            });
        });
    }
    
    // ============================================
    // ROUND TRANSITIONS
    // ============================================
    
    endRound1() {
        // Show transition and update score
        document.getElementById('transition-r1-score').textContent = this.score.round1;
        
        // Show items collected
        const itemsList = document.getElementById('transition-items-list');
        itemsList.innerHTML = '';
        if (this.inventory.length === 0) {
            itemsList.innerHTML = '<span style="color: rgba(255,255,255,0.6);">Chưa có trang bị nào</span>';
        } else {
            this.inventory.forEach(itemId => {
                const item = ITEMS[itemId];
                const span = document.createElement('span');
                span.textContent = item.icon;
                span.style.fontSize = '2rem';
                span.style.margin = '0 5px';
                itemsList.appendChild(span);
            });
        }
        
        this.showScreen('transition-screen');
    }
    
    startRound2() {
        this.showScreen('round2-screen');
        this.currentRound = 2;
        this.currentQuestion = 0;
        this.correctStreak = 0;
        this.haloLevel = 0;
        
        // Copy equipment to round 2
        this.updateCharacterEquipment();
        this.updateInventoryDisplay();
        
        this.loadQuestion();
    }
    
    endRound2() {
        if (this.hasGamble) {
            this.showPopup('gamble-modal');
        } else {
            this.finishGame();
        }
    }
    
    // ============================================
    // GAMBLE (ÁO TỨ THÂN)
    // ============================================
    
    rollDice() {
        const dice = document.getElementById('dice');
        const rollBtn = document.getElementById('roll-dice-btn');
        const resultDiv = document.getElementById('gamble-result');
        
        rollBtn.disabled = true;
        dice.classList.add('rolling');
        
        setTimeout(() => {
            dice.classList.remove('rolling');
            
            const win = Math.random() >= 0.5;
            resultDiv.classList.remove('hidden', 'win', 'lose');
            
            if (win) {
                dice.textContent = '🎉';
                resultDiv.classList.add('win');
                resultDiv.textContent = '🍀 MAY MẮN! Điểm x2!';
                this.gambleResult = 'win';
            } else {
                dice.textContent = '💔';
                resultDiv.classList.add('lose');
                resultDiv.textContent = '😢 Không may! Điểm ÷2';
                this.gambleResult = 'lose';
            }
            
            rollBtn.textContent = '✅ Tiếp tục';
            rollBtn.disabled = false;
            rollBtn.onclick = () => {
                this.hidePopup('gamble-modal');
                this.finishGame();
            };
        }, 2000);
    }
    
    // ============================================
    // END GAME & SCORING
    // ============================================
    
    finishGame() {
        this.hidePopup('gamble-popup');
        
        // Calculate total
        let total = this.score.round1 + this.score.round2 + this.score.bonus;
        
        // Apply Gamble result (Áo Tứ Thân) - x2 hoặc ÷2
        if (this.gambleResult === 'win') {
            total = total * 2;
        } else if (this.gambleResult === 'lose') {
            total = Math.floor(total / 2);
        }
        
        // Apply Nón Lá multiplier
        if (this.equippedItems.hat === 'nonLa') {
            total = Math.floor(total * 1.1);
        }
        
        this.score.total = total;
        
        // Update end screen
        document.getElementById('final-round1').textContent = this.score.round1;
        document.getElementById('final-round2').textContent = this.score.round2;
        
        // Update bonus section
        const bonusSection = document.getElementById('bonus-section');
        const bonusDetails = document.getElementById('bonus-details');
        bonusDetails.innerHTML = '';
        
        // Hiển thị tất cả items đã trang bị và effect của chúng
        let hasAnyBonus = false;
        Object.entries(this.equippedItems).forEach(([slot, itemId]) => {
            if (!itemId) return;
            const item = ITEMS[itemId];
            if (!item || !item.effect) return;
            
            hasAnyBonus = true;
            const bonusItem = document.createElement('div');
            bonusItem.className = 'bonus-item';
            
            // Tạo mô tả effect dựa trên loại
            let effectText = '';
            switch (item.effect.type) {
                case 'BONUS_SCORE':
                    effectText = `+${item.effect.value}`;
                    break;
                case 'MULTIPLY_TOTAL':
                    effectText = `x${item.effect.value} (tổng điểm)`;
                    break;
                case 'INCREASE_DROP_RATE':
                    effectText = `+${item.effect.value * 100}% drop`;
                    break;
                case 'SECOND_CHANCE':
                    effectText = `${item.effect.value}% chọn lại`;
                    break;
                case 'DOUBLE_ROUND1_SCORE':
                    effectText = `${item.effect.value}đ/câu V1`;
                    break;
                case 'GAMBLE':
                    if (this.gambleResult === 'win') {
                        effectText = `x2 (tổng điểm)`;
                    } else if (this.gambleResult === 'lose') {
                        effectText = `÷2 (tổng điểm)`;
                    } else {
                        effectText = `50/50 x2 hoặc ÷2`;
                    }
                    break;
                default:
                    effectText = item.description;
            }
            
            bonusItem.innerHTML = `
                <span>${item.icon} ${item.name}</span>
                <span class="bonus-value">${effectText}</span>
            `;
            bonusDetails.appendChild(bonusItem);
        });
        
        if (hasAnyBonus) {
            bonusSection.classList.remove('hidden');
        } else {
            bonusSection.classList.add('hidden');
        }
        
        document.getElementById('final-total').textContent = this.score.total;
        document.getElementById('end-player-name').textContent = this.playerName;
        
        // Determine rank
        const rank = this.calculateRank(this.score.total);
        document.getElementById('rank-title').textContent = rank;
        
        // Copy equipment to end screen
        this.updateCharacterEquipment();
        this.updateHalo();
        
        // Update equipment slots on end screen
        const slots = ['hat', 'top', 'bottom', 'shoes', 'vehicle'];
        slots.forEach(slot => {
            const itemId = this.equippedItems[slot];
            const slotElement = document.getElementById(`end-equip-${slot}`);
            if (slotElement) {
                if (itemId && ITEMS[itemId]) {
                    slotElement.textContent = ITEMS[itemId].icon;
                } else {
                    slotElement.textContent = '';
                }
            }
        });
        
        // Save to leaderboard
        this.addToLeaderboard();
        
        // Show end screen
        this.showScreen('end-screen');
    }
    
    calculateRank(score) {
        if (score >= 500) return '🏆 Nhà Tư Tưởng Đại Tài';
        if (score >= 400) return '🥇 Bậc Thầy Tri Thức';
        if (score >= 300) return '🥈 Học Giả Uyên Bác';
        if (score >= 200) return '🥉 Người Học Trò Xuất Sắc';
        if (score >= 100) return '📚 Người Tìm Kiếm Tri Thức';
        return '🌱 Mầm Non Tư Tưởng';
    }
    
    addToLeaderboard() {
        this.leaderboard.push({
            name: this.playerName,
            score: this.score.total,
            date: new Date().toLocaleDateString('vi-VN')
        });
        
        // Sort and keep top 10
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 10);
        
        this.saveLeaderboard();
        this.updateLeaderboardDisplay();
    }
    
    updateLeaderboardDisplay() {
        const lists = ['leaderboard-list', 'end-leaderboard-list'];
        
        lists.forEach(listId => {
            const list = document.getElementById(listId);
            if (!list) return;
            
            list.innerHTML = '';
            
            if (this.leaderboard.length === 0) {
                list.innerHTML = '<p class="leaderboard-empty">Chưa có dữ liệu.Hãy là người đầu tiên!</p>';
                return;
            }
            
            this.leaderboard.forEach((entry, index) => {
                const div = document.createElement('div');
                div.className = 'leaderboard-entry';
                if (index < 3) div.classList.add(`top-${index + 1}`);
                
                const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
                
                div.innerHTML = `
                    <span class="leaderboard-rank">${rankEmoji}</span>
                    <span class="leaderboard-name">${entry.name}</span>
                    <span class="leaderboard-score">${entry.score} điểm</span>
                `;
                list.appendChild(div);
            });
        });
    }
    
    // ============================================
    // UI UPDATES
    // ============================================
    // UI UPDATES
    // ============================================
    
    updateUI() {
        const totalScore = this.score.round1 + this.score.round2;
        const prefix = this.currentRound === 1 ? 'r1' : 'r2';
        
        // Update score
        document.getElementById(`${prefix}-current-score`).textContent = totalScore;
        
        // Update question counter
        document.getElementById(`${prefix}-question-current`).textContent = this.currentQuestion + 1;
        
        // Update progress bar
        const progress = ((this.currentQuestion + 1) / this.totalQuestions[`round${this.currentRound}`]) * 100;
        document.getElementById(`${prefix}-progress-fill`).style.width = `${progress}%`;
        
        // Update star count (Round 2 only)
        if (this.currentRound === 2) {
            document.getElementById('r2-star-count').textContent = this.stars;
        }
    }
    
    updateHalo() {
        const containers = ['r2-halo-container', 'end-halo-container'];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            
            for (let i = 0; i < this.haloLevel && i < 3; i++) {
                const ring = document.createElement('div');
                ring.className = 'halo-ring';
                container.appendChild(ring);
            }
        });
    }
    
    // ============================================
    // RESET GAME
    // ============================================
    
    resetGame() {
        // Reset all state
        this.currentRound = 1;
        this.currentQuestion = 0;
        this.score = { round1: 0, round2: 0, bonus: 0, total: 0 };
        this.round1BaseScore = 10;
        this.round1CorrectAnswers = 0;
        this.correctStreak = 0;
        this.haloLevel = 0;
        this.stars = 5;
        this.inventory = [];
        this.equippedItems = {};
        this.dropRateBonus = 0;
        this.itemsDropped = 0;
        this.hasSecondChance = false;
        this.hasGamble = false;
        this.gambleResult = null;
        
        // Reset UI
        document.getElementById('r1-halo-container').innerHTML = '';
        document.getElementById('r2-halo-container').innerHTML = '';
        document.getElementById('end-halo-container').innerHTML = '';
        
        // Reset gamble modal
        const gambleModal = document.getElementById('gamble-modal');
        if (gambleModal) {
            gambleModal.classList.add('hidden');
            document.getElementById('dice').textContent = '🎲';
            document.getElementById('gamble-result').classList.add('hidden');
            const rollBtn = document.getElementById('roll-dice-btn');
            rollBtn.textContent = '🎲 Quay Xúc Xắc!';
            rollBtn.disabled = false;
            rollBtn.onclick = () => this.rollDice();
        }
        
        // Shuffle questions
        this.questions = {
            round1: this.shuffleArray([...QUESTIONS.round1]),
            round2: this.shuffleArray([...QUESTIONS.round2])
        };
        
        // Go back to start
        this.showScreen('start-screen');
    }
}

// ============================================
// INITIALIZE GAME
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});