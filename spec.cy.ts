describe('Task 3', () => {
  const username = 'noer'

  beforeEach(() => {
    cy.visit('http://localhost:4200/')
  })

  it('should visit localhost:4200 and land on login page', () => {
    cy.get('[data-cy="text-title-login"]').contains('Login')
  })

  it('should get field for input username and type "noer"', () => {
    cy.get('[data-cy="input-name"]').type(username)
  })

  it('should get field for input password and type "noer"', () => {
    cy.get('[data-cy="input-password"]').type(username)
  })

  it('should login with username = "noer" and password = "noer" then land on purchase page', () => {
    cy.get('[data-cy="input-name"]').type(username)
    cy.get('[data-cy="input-password"]').type(username)
    cy.get('[data-cy="btn-login"]').click()
    cy.get('[data-cy="text-navbar-profile-name"]').should('contain', `Hi, ${username}`)
  })
})

describe('Additional Task', () => {
  // before only run once
  // beforeEach run before each it
  beforeEach(() => {
    const username = 'noer'
    cy.visit('http://localhost:4200/')
    cy.get('[data-cy="input-name"]').type(username)
    cy.get('[data-cy="input-password"]').type(username)
    cy.get('[data-cy="btn-login"]').click()
    cy.get('[data-cy="text-navbar-profile-name"]').contains(`Hi, ${username}`)
  })

  it('should add some items (id:1,3) from menu to cart', () => {
    cy.get('[data-cy="btn-add-menu-item-to-cart"]').each((item, index) => {
      if (index % 2 == 1) {

        cy.get(item).click()

        cy.get(`:nth-of-type(${index + 1}) > .card-body > [data-cy="text-menu-item-name"]`).then((it) => {
          cy.get('[data-cy="cart-item"]').contains(it.text())
        })
      }
    })
  })

  it('should checkout cart successfully', () => {
    cy.get('[data-cy="btn-add-menu-item-to-cart"]').each((item, index) => {
      if (index % 2 == 1) {
        cy.get(item).click()
        cy.get(`:nth-of-type(${index + 1}) > .card-body > [data-cy="text-menu-item-name"]`).then((it) => {
          cy.get('[data-cy="cart-item"]').contains(it.text())
        })
      }
    })
    cy.get('[data-cy="btn-checkout"]').click()
    cy.get('[data-cy="alert-message"]').should('contain', 'Items Purchased')
  })

  it('should log out user', () => {
    cy.get('[data-cy="btn-logout"]').click()
    cy.get('[data-cy="text-title-login"]').contains('Login')
  })

  it('should do all the step', () => {
    cy.get('[data-cy="btn-add-menu-item-to-cart"]').each((item, index) => {
      if (index % 2 == 1) {
        cy.get(item).click()
        cy.get(`:nth-of-type(${index + 1}) > .card-body > [data-cy="text-menu-item-name"]`).then((it) => {
          cy.get('[data-cy="cart-item"]').contains(it.text())
        })
      }
    })
    cy.get('[data-cy="btn-checkout"]').click()
    cy.get('[data-cy="alert-message"]').should('contain', 'Items Purchased')
    cy.get('[data-cy="btn-logout"]').click()
    cy.get('[data-cy="text-title-login"]').contains('Login')
  })
})

describe('Youtube', () => {
  it('should visit youtube and click a video', () => {
    cy.visit('https://youtube.com')
    cy.get(':nth-child(1) > #contents > :nth-child(1) > #content > .ytd-rich-item-renderer > #dismissible > :nth-child(1)').as('video')
    cy.get('@video').click()
  })
})