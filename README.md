# Taejun Lee — Academic CV

Source for my academic CV and portfolio website, focused on computer architecture, GPU and accelerator systems, memory systems, and hardware–software co-design.

**Website:** [wheel0012.github.io](https://wheel0012.github.io)  
**Printable CV:** [wheel0012.github.io/cv/](https://wheel0012.github.io/cv/)

## Structure

- `docs/index.md` — web CV homepage
- `docs/cv.html` — print-friendly CV
- `docs/_data/cv.yml` — shared CV content
- `docs/assets/slides/` — selected project and competition presentations

## Local preview

The site is built with Jekyll and GitHub Pages from the `docs/` directory.

Install Bundler for the current user and expose user-installed gem commands:

```bash
gem install --user-install bundler
export PATH="$(ruby -e 'print Gem.user_dir')/bin:$PATH"
```

To keep the PATH setting across Bash sessions, add the `export` line to `~/.bashrc` and open a new terminal. The dynamic `Gem.user_dir` expression keeps working when the Ruby version changes.

Install the project gems and launch the local site:

```bash
cd docs
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>.

## Print validation

Install the print tooling once from the repository root:

```bash
npm install
npm run cv:setup
```

Then validate or generate the one-page A4 CV:

```bash
npm run cv:check  # verify one A4 page at 100%
npm run cv:pdf    # generate artifacts/Taejun_Lee_CV.pdf
npm run cv:fit    # auto-fit between 100% and 92%, then generate PDF
```
