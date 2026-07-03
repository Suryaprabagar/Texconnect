# Texconnect
Texconnect is a specialized B2B marketplace platform designed to bridge the gap between textile manufacturers in Tirupur, India, and global/local buyers. It streamlines the garment sourcing process through a dedicated digital ecosystem.

## Security Scanning with Strix

Strix is integrated into our CI/CD pipeline to perform autonomous security penetration testing on all pull requests and pushes to the `surya` branch.

### Required GitHub Secrets

To make the scanning process work, you need to configure the following Secrets in your repository:

1. **`LLM_API_KEY`** (Required): A valid API key for your chosen LLM provider (e.g. Google Gemini, OpenAI, or Anthropic). The workflow automatically maps this secret to provider-specific environment variables like `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `OPENAI_API_KEY`, and `ANTHROPIC_API_KEY`.
2. **`STRIX_LLM`** (Optional): The identifier for the LLM provider and model (e.g. `gemini/gemini-2.5-pro` or `openai/gpt-4o`). If not provided, it defaults to `gemini/gemini-2.5-pro`.


To configure these:
1. Go to your repository on GitHub.
2. Select **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret** and add the keys.
