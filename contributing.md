# Contributing

Thank you for your interest in contributing to **Revision Notes**.

This repository is intended to be a structured, production-quality knowledge base for Software Engineering, Computer Science, Backend Engineering, Artificial Intelligence, and Interview Preparation.

Please read the following guidelines before contributing.

---

# Contribution Workflow

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/topic-name
```

3. Make your changes.

4. Test locally.

```bash
mkdocs serve
```

5. Verify the documentation builds successfully.

```bash
mkdocs build --strict
```

6. Commit your changes.

```bash
git commit -m "Add operating system scheduling notes"
```

7. Push your branch.

```bash
git push origin feature/topic-name
```

8. Open a Pull Request.

---

# Repository Structure

All documentation resides inside the `docs/` directory.

```
docs/

computer-science/

programming/

data/

assets/

resources.md

roadmap.md
```

Do not place documentation outside the `docs/` folder unless it relates to repository configuration.

---

# Writing Guidelines

Documentation should be:

* Technically accurate
* Concise
* Well structured
* Easy to navigate
* Free of grammatical errors
* Written in Markdown

Avoid:

* Unverified information
* AI-generated filler
* Marketing language
* Duplicate content
* Excessive emojis
* Unnecessary images

---

# Markdown Style

Use proper heading hierarchy.

```markdown
# Title

## Section

### Subsection
```

Always include fenced code blocks.

````markdown
```python
print("Hello World")
```
````

Prefer tables for comparisons.

Example:

| Feature       | Java | Python |
| ------------- | ---- | ------ |
| Static Typing | Yes  | No     |

Use bullet lists where appropriate.

---

# Naming Conventions

Use lowercase file names.

Good

```
system-design.md
```

Bad

```
SystemDesign.md
```

Use hyphens instead of spaces.

---

# Folder Organization

Related topics should be grouped together.

Example

```
computer-science/

operating-systems.md

computer-networks.md

databases.md
```

---

# Code Examples

All code examples should:

* Compile when applicable
* Follow language best practices
* Be minimal but complete
* Include comments only when necessary

---

# Pull Request Checklist

Before submitting a Pull Request, ensure:

* Documentation builds successfully
* No broken Markdown links
* Proper heading hierarchy
* Correct grammar and spelling
* Navigation updated if new pages are added
* No duplicate content

---

# Issue Reporting

When reporting issues, include:

* Description
* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots (if applicable)

---

# Documentation Standards

Contributions should prioritize:

* Conceptual clarity
* Practical examples
* Production-oriented explanations
* Industry best practices

Avoid opinion-based or speculative content unless explicitly identified as such.

---

# License

By contributing to this repository, you agree that your contributions will be licensed under the same license as this project.
