/**
 * @param {string} fixedStandard - 허용범위 문자열 (예: ">= 12", "< 50").
 * @param {string} measuredValue - 측정값 문자열.
 * @returns {string} - 판정 결과 ('적합', '부적합', '측정 오류', 또는 빈 문자열).
 */
export function getJudgment(fixedStandard, measuredValue) {
    // 입력값이 없으면 빈 문자열 반환
    if (!fixedStandard || !measuredValue) {
        return '';
    }

    // 정규 표현식을 사용하여 연산자와 값을 추출합니다.
    const match = fixedStandard.match(/([<>=]+)\s*(\d+(\.\d+)?)/);
    if (!match) {
        return '측정 오류';
    }

    const operator = match[1].trim();
    const standardValue = parseFloat(match[2]);
    const value = parseFloat(measuredValue);

    // 숫자로 변환할 수 없는 경우 '측정 오류' 반환
    if (isNaN(standardValue) || isNaN(value)) {
        return '측정 오류';
    }

    // 연산자에 따라 판정 로직 적용
    switch (operator) {
        case '<':
            return value < standardValue ? '적합' : '부적합';
        case '<=':
            return value <= standardValue ? '적합' : '부적합';
        case '>':
            return value > standardValue ? '적합' : '부적합';
        case '>=':
            return value >= standardValue ? '적합' : '부적합';
        case '=':
            return value === standardValue ? '적합' : '부적합';
        default:
            return '연산자 오류';
    }
}
