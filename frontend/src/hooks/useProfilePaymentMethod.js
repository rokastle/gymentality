import { useMemo, useState } from "react";
import { buildTouchedFields } from "../utils/formStateUtils";
import {
  emptyCardForm,
  getCardBrand,
  getInitialStoredCard,
} from "../utils/profilePageUtils";
import {
  hasPaymentValidationErrors,
  normalizeCardNumber,
  paymentFieldNames,
  validatePaymentForm,
} from "../utils/paymentValidation";

export default function useProfilePaymentMethod({ user, updatePaymentMethod }) {
  const [storedCardOverride, setStoredCardOverride] = useState(null);
  const [isPaymentEditOpen, setIsPaymentEditOpen] = useState(false);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [paymentTouched, setPaymentTouched] = useState({});
  const [paymentSubmitAttempted, setPaymentSubmitAttempted] = useState(false);

  const storedCard = useMemo(() => {
    if (storedCardOverride?.userId === user?.id) {
      return storedCardOverride.card;
    }

    return getInitialStoredCard(user);
  }, [storedCardOverride, user]);

  const paymentErrors = useMemo(() => validatePaymentForm(cardForm), [cardForm]);

  const hasPaymentErrors = hasPaymentValidationErrors(paymentErrors);

  const handleCardFormChange = (event) => {
    const { name, type, value, checked } = event.target;

    setCardForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "cardNumber" || name === "cvv"
            ? value.replace(/\D/g, "")
            : value,
    }));
  };

  const handleCardBlur = (event) => {
    const { name } = event.target;

    setPaymentTouched((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const handleOpenPaymentEdit = () => {
    setCardForm({
      cardholder: "",
      cardNumber: "",
      expiryMonth: storedCard.expiryMonth || "",
      expiryYear: storedCard.expiryYear || "",
      cvv: "",
      saveForFuture: storedCard.saveCardForFuture ?? true,
    });

    setPaymentTouched({});
    setPaymentSubmitAttempted(false);
    setIsPaymentEditOpen(true);
  };

  const handleCancelPaymentEdit = () => {
    setCardForm(emptyCardForm);
    setPaymentTouched({});
    setPaymentSubmitAttempted(false);
    setIsPaymentEditOpen(false);
  };

  const markAllPaymentFieldsAsTouched = () => {
    setPaymentTouched(buildTouchedFields(paymentFieldNames));
    setPaymentSubmitAttempted(true);
  };

  const savePaymentMethod = async () => {
    const cleanCardNumber = normalizeCardNumber(cardForm.cardNumber);
    const last4 = cleanCardNumber.slice(-4);

    await updatePaymentMethod({
      paymentMethod: "card",
      cardLast4: last4,
      cardExpiryMonth: cardForm.expiryMonth,
      cardExpiryYear: cardForm.expiryYear,
      saveCardForFuture: cardForm.saveForFuture,
    });

    setStoredCardOverride({
      userId: user?.id,
      card: {
        brand: getCardBrand(cleanCardNumber),
        last4,
        expiryMonth: cardForm.expiryMonth,
        expiryYear: cardForm.expiryYear,
        saveCardForFuture: cardForm.saveForFuture,
        hasStoredCard: true,
      },
    });

    setCardForm(emptyCardForm);
    setPaymentTouched({});
    setPaymentSubmitAttempted(false);
    setIsPaymentEditOpen(false);
  };

  return {
    storedCard,
    isPaymentEditOpen,
    cardForm,
    paymentTouched,
    paymentSubmitAttempted,
    paymentErrors,
    hasPaymentErrors,
    handleCardFormChange,
    handleCardBlur,
    handleOpenPaymentEdit,
    handleCancelPaymentEdit,
    markAllPaymentFieldsAsTouched,
    savePaymentMethod,
  };
}
