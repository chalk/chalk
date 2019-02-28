export default function config() {
	return process.env.CI ? {tap: true} : {};
}
