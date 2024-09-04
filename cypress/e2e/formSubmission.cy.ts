describe('登入跟表單提交測試', () => {
  beforeEach(() => {
    // 訪問登入頁面
    cy.visit('/login');
  });

  it('使用者登入後成功提交表單', () => {
    // 模擬登入 API
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [{ id: 1, username: 'testuser', password: '12345' }],
    }).as('loginRequest');

    // 登入步驟
    cy.get('input[formControlName="username"]').type('testuser');
    cy.get('input[formControlName="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    // 驗證成功登入後跳轉到主頁
    cy.url().should('include', '/home/unit-test-example');

    // 訪問表單頁面（假設已登入後自動跳轉到這裡）
    cy.visit('/home/unit-test-example');

    // 檢查表單元素是否存在
    cy.get('input[formControlName="name"]').should('exist').and('be.visible');
    cy.get('input[formControlName="email"]').should('exist').and('be.visible');
    cy.get('input[formControlName="phone"]').should('exist').and('be.visible');
    // // 檢查 gender 下拉選單
    cy.get('select[formControlName="gender"]')
      .should('exist')
      .and('be.visible');
    // 檢查 kind 選項的 radio buttons 是否存在且顯示
    cy.get('input[type="radio"][formControlName="kind"][id="kind-meat"]')
      .should('exist')
      .and('be.visible');
    cy.get('input[type="radio"][formControlName="kind"][id="kind-meat"]')
      .should('exist')
      .and('be.visible');

    // 模擬表單提交的 API request
    cy.intercept('POST', '**/submit', {
      statusCode: 200,
      body: { message: '表單提交成功' },
    }).as('formSubmit');

    // 填寫表單
    cy.get('input[formControlName="name"]').type('John Doe');
    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="phone"]').type('1234567890');
    cy.get('select[formControlName="gender"]').select('male');
    cy.get(
      'input[type="radio"][formControlName="kind"][id="kind-meat"]',
    ).check();

    // 提交表單
    cy.get('button[type="submit"]').click();

    // 檢查是否顯示成功
    cy.on('window:alert', (str) => {
      expect(str).to.equal('表單提交成功');
    });

    // 確保 API request 已送
    cy.wait('@formSubmit').its('response.statusCode').should('eq', 200);
  });

  it('應該顯示表單提交失敗錯誤', () => {
    // 使用攔截器來模擬登入 API
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [{ id: 1, username: 'testuser', password: '12345' }],
    }).as('loginRequest');

    // 登入步驟
    cy.get('input[formControlName="username"]').type('testuser');
    cy.get('input[formControlName="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    // 訪問表單頁面
    cy.visit('/home/unit-test-example');

    // 模擬表單提交失敗的 API request
    cy.intercept('POST', '**/submit', {
      statusCode: 500,
      body: { message: '表單提交失敗' },
    }).as('formSubmitFailed');

    // 填寫表單
    cy.get('input[formControlName="name"]').type('John Doe');
    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="phone"]').type('1234567890');
    cy.get('select[formControlName="gender"]').select('male');
    cy.get(
      'input[type="radio"][formControlName="kind"][id="kind-meat"]',
    ).check();

    // 提交表單
    cy.get('button[type="submit"]').click();

    // 檢查是否顯示錯誤訊息
    cy.on('window:alert', (str) => {
      expect(str).to.equal('表單提交失敗');
    });

    // 確保 API request 已發送
    // 檢查 response 物件的 statusCode 屬性
    // eq = equal
    cy.wait('@formSubmitFailed').its('response.statusCode').should('eq', 500);
  });
});
