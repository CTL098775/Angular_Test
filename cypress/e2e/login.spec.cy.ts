describe('Login Page Tests', () => {
  // 攔截 HTTP request
  // intercept (HTTP 方法, 路徑)
  const setupLoginIntercept = () => {
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [{ id: 1, username: 'testuser', password: '12345' }],
    }).as('loginRequest');
  };

  beforeEach(() => {
    // 在每個測試之前到登錄畫面
    cy.visit('/login');
  });

  it('應正確顯示登入表單', () => {
    // 驗證登錄畫面顯示表單
    cy.get('input[formControlName="username"]')
      .should('exist')
      .and('be.visible');
    cy.get('input[formControlName="password"]')
      .should('exist')
      .and('be.visible');
    cy.get('button[type="submit"]').should('exist').and('be.visible');
  });

  it('應顯示未輸入欄位的驗證', () => {
    // 點擊提交按鈕(不輸入內容)
    cy.get('button[type="submit"]').click();

    // 驗證表單顯示錯誤訊息
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
    setupLoginIntercept();
    // 填寫有效的帳號密碼
    cy.get('input[formControlName="username"]').type('testuser');
    cy.get('input[formControlName="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    // 驗證成功登入後到主頁
    cy.url().should('include', '/home');
  });

  it('應顯示登入無效錯誤訊息', () => {
    setupLoginIntercept();

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
    setupLoginIntercept();

    // 先登入
    cy.get('input[formControlName="username"]').type('testuser');
    cy.get('input[formControlName="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    // 確認當前 URL 包含 /home/unit-test-example
    cy.url().should('include', '/home/unit-test-example');

    // 點登出
    cy.get('.logout-button').click();

    // 回到登入頁面
    cy.url().should('include', '/login'); // 驗證是否重新回到登入頁面
    cy.get('input[formControlName="username"]').should('be.visible'); // 確認帳號輸入框顯示
  });
});
