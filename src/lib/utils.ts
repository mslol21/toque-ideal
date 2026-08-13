import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CartItem, ClientData } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function generateQuoteId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TQ-${year}-${randomNum}`;
}

export function calculateCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((acc, item) => acc + item.lineSubtotal, 0);
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  let discountPercentage = 0;
  if (totalUnits >= 1000) {
    discountPercentage = 0.15;
  } else if (totalUnits >= 500) {
    discountPercentage = 0.12;
  } else if (totalUnits >= 300) {
    discountPercentage = 0.08;
  } else if (totalUnits >= 100) {
    discountPercentage = 0.05;
  }

  const discountAmount = subtotal * discountPercentage;
  const totalAmount = subtotal - discountAmount;

  return {
    subtotal,
    totalUnits,
    discountPercentage,
    discountAmount,
    totalAmount,
  };
}

export function buildWhatsAppUrl(
  phoneNumber: string,
  quoteNumber: string,
  clientName: string,
  companyName: string,
  items: CartItem[],
  totalAmount: number,
  clientData?: ClientData
): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  // Target phone number: if client phone is valid, use it; otherwise official Toque Ideal sales line: (11) 96776-7364
  const targetPhone = cleanPhone.length >= 10 ? cleanPhone : '5511967767364';

  let message = `*SOLICITAÇÃO DE ORÇAMENTO - TOQUE IDEAL*\n`;
  message += `*Orçamento N°:* ${quoteNumber}\n`;
  message += `*Cliente:* ${clientName}\n`;
  message += `*Empresa:* ${companyName}\n`;

  if (clientData?.email) {
    message += `*E-mail:* ${clientData.email}\n`;
  }

  if (clientData?.cep || clientData?.city) {
    message += `*Endereço/Local:* ${clientData.address ? clientData.address + ', ' : ''}${clientData.number ? 'N° ' + clientData.number + ' - ' : ''}${clientData.neighborhood ? clientData.neighborhood + ' - ' : ''}${clientData.city}/${clientData.state}${clientData.cep ? ' (CEP: ' + clientData.cep + ')' : ''}\n`;
  }

  message += `\n*ITENS SELECIONADOS NO SHOWROOM:*\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.product.name}* (SKU: ${item.product.sku})\n`;
    message += `   • Qtd: ${item.quantity} un.\n`;
    if (item.selectedColor) {
      message += `   • Cor do Vidro: *${item.selectedColor}*\n`;
    }
    if (item.hasGoldRim) {
      message += `   • Acabamento: ✨ *Borda Dourada (Filete Ouro 24k)*\n`;
    }
    message += `   • Técnica: ${item.selectedOption}\n`;
    if (item.customNotes) {
      message += `   • Obs: "${item.customNotes}"\n`;
    }
    message += `   • Subtotal: ${formatCurrency(item.lineSubtotal)}\n\n`;
  });

  message += `*VALOR ESTIMADO TOTAL:* ${formatCurrency(totalAmount)}\n\n`;
  message += `Gostaria de dar andamento a este orçamento!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
}
