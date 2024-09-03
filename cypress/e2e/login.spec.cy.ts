describe('Login Page Tests', () => {
  beforeEach(() => {
    // 在每個測試之前到登錄畫面
    cy.visit('/login');
  });

  it('正確顯示登入並登入', () => {
    // 驗證登錄畫面顯示表單
    cy.get('input[formControlName="username"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });
});
