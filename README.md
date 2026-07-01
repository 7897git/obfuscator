# 🔐 Obfuscator

A powerful JavaScript code obfuscation tool that helps protect your code from reverse engineering and intellectual property theft.

## ✨ Features

- **JavaScript Obfuscation**: Obfuscate your JavaScript code to make it harder to read and understand
- **Variable Renaming**: Automatically rename variables to meaningless names
- **String Encoding**: Encode strings to hide sensitive information
- **Dead Code Insertion**: Add dead code to increase complexity
- **Web Interface**: User-friendly web interface for easy obfuscation
- **Fast & Efficient**: Process large codebases quickly
- **Customizable Options**: Fine-tune obfuscation settings to your needs

## 🚀 Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm or yarn

### Installation

```bash
git clone https://github.com/7897git/obfuscator.git
cd obfuscator
npm install
```

### Usage

#### Command Line

```bash
npm start
```

This will start the local web server where you can use the obfuscation tool through the browser interface.

#### Web Interface

1. Open your browser and navigate to `http://localhost:3000` (or the configured port)
2. Paste your JavaScript code in the input area
3. Configure obfuscation options as needed
4. Click "Obfuscate" to process your code
5. Copy the obfuscated code from the output area

## 📝 Obfuscation Options

| Option | Description |
|--------|-------------|
| Variable Renaming | Rename variables to random identifiers |
| String Encoding | Encode string literals |
| Remove Comments | Strip all comments from code |
| Compact Output | Minimize whitespace in output |
| Dead Code | Insert dummy code to increase complexity |

## 📁 Project Structure

```
obfuscator/
├── public/          # Static files (HTML, CSS)
├── src/             # Source JavaScript files
├── index.js         # Main application entry point
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## 🔧 Technologies Used

- **JavaScript (59%)** - Core obfuscation logic
- **HTML (41%)** - Web interface

## 💡 How It Works

The obfuscator transforms readable JavaScript code into a much harder-to-read version while maintaining the same functionality:

1. **Parsing**: Parse the input JavaScript code
2. **Transformation**: Apply obfuscation techniques:
   - Rename identifiers
   - Encode strings
   - Remove unnecessary whitespace
   - Optionally insert dead code
3. **Generation**: Generate the obfuscated output

## ⚠️ Important Notes

- **Testing**: Always test obfuscated code thoroughly to ensure it works correctly
- **Backup**: Keep a backup of your original source code
- **Performance**: Obfuscation may slightly impact performance depending on options used
- **Not Unbreakable**: Obfuscation increases difficulty of reverse engineering but is not 100% secure

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

## 📚 Additional Resources

- [JavaScript Obfuscation Best Practices](https://owasp.org/www-community/attacks/Code_Obfuscation)
- [JavaScript Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Happy Obfuscating! 🎉**
