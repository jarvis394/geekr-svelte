import { Parser } from '@lezer/common'
import { Language, LanguageDescription } from '@codemirror/language'
import { type Highlighter, highlightCode as lezerHighlightCode } from '@lezer/highlight'
import { languages } from '@codemirror/language-data'
import escape from 'escape-html'

export async function getCodeParser(
	languageName: string,
	defaultLanguage?: Language
): Promise<Parser | null> {
	if (languageName && languages) {
		const found = LanguageDescription.matchLanguageName(languages, languageName, true)

		if (found instanceof LanguageDescription) {
			if (!found.support) await found.load()

			return found.support ? found.support.language.parser : null
		} else if (found) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (found as any).parser
		}
	}

	return defaultLanguage ? defaultLanguage.parser : null
}

export async function highlightCode(
	languageName: string,
	input: string,
	highlighter: Highlighter
): Promise<string> {
	const parser = await getCodeParser(languageName)

	if (parser) {
		const tree = parser.parse(input)
		const res: string[] = []
		const emitText = (text: string, classes: string) => {
			console.log({ text, e: escape(text), classes })
			if (classes) {
				res.push(`<span class="${classes}">${escape(text)}</span>`)
			} else {
				res.push(escape(text))
			}
		}
		const emitBreak = () => {
			res.push(`<br />`)
		}

		lezerHighlightCode(input, tree, highlighter, emitText, emitBreak)

		return res.join('')
	}

	return input
}
