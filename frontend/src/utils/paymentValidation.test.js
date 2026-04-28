import { describe, expect, it } from 'vitest'
import {
  normalizeCardNumber,
  isValidCardNumber,
  validatePaymentField,
  validatePaymentForm,
  hasPaymentValidationErrors,
} from './paymentValidation'

describe('paymentValidation', () => {
  it('normaliza el número de tarjeta eliminando espacios y caracteres no numéricos', () => {
    expect(normalizeCardNumber('4111 1111-1111 1111')).toBe('4111111111111111')
  })

  it('valida correctamente un número de tarjeta válido mediante Luhn', () => {
    expect(isValidCardNumber('4111 1111 1111 1111')).toBe(true)
  })

  it('rechaza un número de tarjeta inválido', () => {
    expect(isValidCardNumber('4111 1111 1111 1112')).toBe(false)
  })

  it('valida el CVV correctamente', () => {
    expect(validatePaymentField('cvv', '123', {})).toBe('')
    expect(validatePaymentField('cvv', '12', {})).toBe('CVV must have 3 or 4 digits')
  })

  it('rechaza una fecha de caducidad vencida', () => {
    const expiredForm = {
      expiryMonth: '01',
      expiryYear: String(new Date().getFullYear() - 1),
    }

    expect(validatePaymentField('expiryMonth', expiredForm.expiryMonth, expiredForm)).toBe(
      'Invalid expiry date'
    )
  })

  it('valida un formulario de pago correcto', () => {
    const validForm = {
      cardholder: 'Roberto Castillo',
      cardNumber: '4111 1111 1111 1111',
      expiryMonth: '12',
      expiryYear: String(new Date().getFullYear() + 1),
      cvv: '123',
    }

    const errors = validatePaymentForm(validForm)

    expect(hasPaymentValidationErrors(errors)).toBe(false)
    expect(errors).toEqual({
      cardholder: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    })
  })
})
