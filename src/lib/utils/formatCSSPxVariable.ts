const formatCSSPxVariable = (value: string | number | null | undefined) => {
	if (value === null || value === undefined) return 'initial'
	if (!isNaN(Number(value))) {
		return value + 'px'
	}
	return value
}

export default formatCSSPxVariable
