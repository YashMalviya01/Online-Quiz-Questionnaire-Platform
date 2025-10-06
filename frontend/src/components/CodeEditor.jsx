import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../store/themeStore';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Spinner } from './ui/Loading';
import {
  Play,
  RotateCcw,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  Settings
} from 'lucide-react';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript', extension: '.js' },
  { value: 'python', label: 'Python', extension: '.py' },
  { value: 'java', label: 'Java', extension: '.java' },
  { value: 'cpp', label: 'C++', extension: '.cpp' },
  { value: 'c', label: 'C', extension: '.c' },
  { value: 'csharp', label: 'C#', extension: '.cs' },
  { value: 'typescript', label: 'TypeScript', extension: '.ts' },
  { value: 'go', label: 'Go', extension: '.go' },
  { value: 'rust', label: 'Rust', extension: '.rs' },
  { value: 'php', label: 'PHP', extension: '.php' },
  { value: 'ruby', label: 'Ruby', extension: '.rb' },
  { value: 'sql', label: 'SQL', extension: '.sql' }
];

const DEFAULT_CODE = {
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  python: '# Write your Python code here\nprint("Hello, World!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
  typescript: '// Write your TypeScript code here\nconsole.log("Hello, World!");',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  rust: 'fn main() {\n    println!("Hello, World!");\n}',
  php: '<?php\necho "Hello, World!";\n?>',
  ruby: '# Write your Ruby code here\nputs "Hello, World!"',
  sql: '-- Write your SQL query here\nSELECT "Hello, World!";'
};

export default function CodeEditor({
  initialCode = '',
  language = 'javascript',
  onLanguageChange,
  onCodeChange,
  onRunCode,
  readOnly = false,
  height = '500px',
  showToolbar = true,
  allowLanguageChange = true
}) {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const [code, setCode] = useState(initialCode || DEFAULT_CODE[language]);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    } else if (DEFAULT_CODE[selectedLanguage]) {
      setCode(DEFAULT_CODE[selectedLanguage]);
    }
  }, [initialCode, selectedLanguage]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunCode) onRunCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, (e) => {
      e.preventDefault();
      handleDownload();
    });

    // Add custom theme
    monaco.editor.defineTheme('customDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editorLineNumber.foreground': '#858585',
        'editorCursor.foreground': '#ffffff',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41'
      }
    });

    monaco.editor.defineTheme('customLight', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editorLineNumber.foreground': '#237893',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#add6ff',
        'editor.inactiveSelectionBackground': '#e5ebf1'
      }
    });
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (onCodeChange) {
      onCodeChange(value);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    if (!initialCode) {
      setCode(DEFAULT_CODE[newLanguage] || '');
    }
  };

  const handleReset = () => {
    const defaultCode = DEFAULT_CODE[selectedLanguage] || '';
    setCode(defaultCode);
    if (onCodeChange) {
      onCodeChange(defaultCode);
    }
  };

  const handleDownload = () => {
    const lang = LANGUAGE_OPTIONS.find(l => l.value === selectedLanguage);
    const filename = `code${lang?.extension || '.txt'}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.py,.java,.cpp,.c,.cs,.ts,.go,.rs,.php,.rb,.sql';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setCode(content);
          if (onCodeChange) {
            onCodeChange(content);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getEditorTheme = () => {
    if (theme === 'dark') return 'customDark';
    if (theme === 'light') return 'customLight';
    // System theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'customDark' : 'customLight';
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {showToolbar && (
        <div className="flex items-center justify-between gap-2 p-2 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            {allowLanguageChange && (
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {onRunCode && (
              <Button
                size="sm"
                onClick={onRunCode}
                disabled={readOnly}
                className="gap-1"
              >
                <Play className="h-4 w-4" />
                Run
                <kbd className="ml-1 text-xs opacity-70">(Ctrl+Enter)</kbd>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!readOnly && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  title="Reset to default"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleUpload}
                  title="Upload file"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleFullscreen}
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="p-3 border-b bg-muted/30 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Font Size:</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
            </select>
          </div>
        </div>
      )}

      <Editor
        height={isFullscreen ? 'calc(100vh - 120px)' : height}
        language={selectedLanguage}
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
        theme={getEditorTheme()}
        options={{
          fontSize: fontSize,
          minimap: { enabled: isFullscreen },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          readOnly: readOnly,
          formatOnPaste: true,
          formatOnType: true,
          suggest: {
            enabled: true
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          padding: { top: 16, bottom: 16 }
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        }
      />
    </div>
  );
}
