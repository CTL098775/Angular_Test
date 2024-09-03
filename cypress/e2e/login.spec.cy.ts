describe('Login Page Tests', () => {
  beforeEach(() => {
    // 在每個測試之前到登錄畫面
    cy.visit('/login');
  });

  it('應正確顯示登入表單', () => {
    // 驗證登錄畫面顯示表單
    cy.get('input[formControlName="username"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('應顯示未輸入欄位的驗證', () => {
    // 點擊提交按鈕(不輸入內容)
    cy.get('button[type="submit"]').click();

    // 驗證表單顯示錯誤消息
    cy.get('input[formControlName="username"]').should(
      'have.class',
      'ng-invalid',
    );
    cy.get('input[formControlName="password"]').should(
      'have.class',
      'ng-invalid',
    );

    // 驗證顯示錯誤訊息
    cy.contains('此欄位必須輸入').should('be.visible');
  });

  it('應使用有效帳密並成功登入', () => {
    // 填寫有效的帳號密碼
    cy.get('input[formControlName="username"]').type('testuser');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // 驗證成功登錄後到主頁
    cy.url().should('include', '/home/unit-test-example');
    cy.contains('Welcome').should('be.visible');
  });

  it('應顯示登入無效錯誤訊息', () => {
    // 填寫無效的帳號密碼
    cy.get('input[formControlName="username"]').type('invaliduser');
    cy.get('input[formControlName="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // 驗證顯示 error message
    cy.on('window:alert', (str) => {
      expect(str).to.equal('帳號密碼輸入錯誤');
    });
  });

  it('應該可成功登出', () => {
    // 先登錄
    cy.get('input[formControlName="username"]').type('testuser');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // 點登出
    cy.get('.logout-button').click();

    // 驗證回到登錄頁面
    cy.url().should('include', '/login'); // 驗證是否重新回到登錄頁面
  });
});
