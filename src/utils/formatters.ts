export function toPersianDigits(n: number | string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (x) => persianNumbers[parseInt(x, 10)]);
}

export function formatPrice(amount: number, unit: string = 'تومان'): string {
  if (isNaN(amount)) return '۰ ' + unit;
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return `${formatted} ${unit}`;
}

export function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ARA-${datePart}-${randomPart}`;
}

export function calculateDiscountPercent(basePrice: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= basePrice) return 0;
  return Math.round(((basePrice - discountPrice) / basePrice) * 100);
}
