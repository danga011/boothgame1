/** 이름 검증: 1~10자, 공백 불가, 한글/영문만 */
export function validateName(name: string): string | null {
  if (!name || name.length === 0) return '이름을 입력해주세요.';
  if (name.length > 10) return '이름은 10자 이하로 입력해주세요.';
  if (/\s/.test(name)) return '이름에 공백을 포함할 수 없습니다.';
  if (!/^[가-힣a-zA-Z]+$/.test(name))
    return '한글 또는 영문만 입력 가능합니다.';
  return null;
}

/** 전화번호 뒷 4자리 검증: 숫자 4자리 */
export function validatePhoneLast4(value: string): string | null {
  if (!value || value.length === 0) return '전화번호 뒷자리를 입력해주세요.';
  if (!/^\d{4}$/.test(value)) return '숫자 4자리를 입력해주세요.';
  return null;
}
