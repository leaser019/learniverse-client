'use client';

import {
  SandpackCodeEditor,
  SandpackConsole,
  sandpackLight,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { Resizable } from 're-resizable';
import { useState } from 'react';
import { FiCode, FiCopy, FiLayout, FiRefreshCw } from 'react-icons/fi';

const templates = {
  react: {
    name: 'React',
    defaultCode: `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>Hello Learniverse!</h1>
      <button onClick={() => setCount(count + 1)}>
        Count is: {count}
      </button>
    </div>
  );
}`,
  },
  vanilla: {
    name: 'JavaScript',
    defaultCode: `document.getElementById("app").innerHTML = \
  <h1>Hello Learniverse!</h1>\n  <div>\n    Start editing to see some magic happen!\n  </div>\n\`;`,
  },
  vue: {
    name: 'Vue',
    defaultCode: `<template>
  <div>
    <h1>Hello Learniverse!</h1>
    <button @click="count++">Count is: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const count = ref(0);
</script>`,
  },
};

// single Learniverse accent theme
const learniverseTheme = {
  ...sandpackLight,
  colors: {
    ...sandpackLight.colors,
    accent: '#0ea5e9', // sky-500
  },
};

function Toolbar({ onReset, onCopy, onToggleConsole, onToggleLayout, showConsole, vertical }) {
  const base = 'p-2 rounded-md hover:bg-sky-100 dark:hover:bg-sky-800 transition-colors';
  return (
    <div className="flex gap-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2">
      <button className={base} onClick={onReset} title="Reset code">
        <FiRefreshCw />
      </button>
      <button className={base} onClick={onCopy} title="Copy code">
        <FiCopy />
      </button>
      <button
        className={`${base} ${showConsole ? 'text-sky-500' : ''}`}
        onClick={onToggleConsole}
        title="Toggle console"
      >
        <FiCode />
      </button>
      <button className={base} onClick={onToggleLayout} title="Change layout">
        <FiLayout />
      </button>
    </div>
  );
}

export default function CodePlayground() {
  const [template, setTemplate] = useState('react');
  const [vertical, setVertical] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [code, setCode] = useState(templates.react.defaultCode);

  const reset = () => setCode(templates[template].defaultCode);
  const copy = () => navigator.clipboard.writeText(code);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-sky-50 dark:bg-sky-900 border-b border-slate-200 dark:border-slate-700">
        <select
          className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1 text-sm"
          value={template}
          onChange={(e) => {
            const t = e.target.value;
            setTemplate(t);
            setCode(templates[t].defaultCode);
          }}
        >
          {Object.entries(templates).map(([k, v]) => (
            <option key={k} value={k}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sandpack */}
      <SandpackProvider
        template={template}
        theme={learniverseTheme}
        customSetup={{ files: { '/App.js': { code } } }}
        options={{ autorun: true }}
      >
        <Toolbar
          onReset={reset}
          onCopy={copy}
          onToggleConsole={() => setShowConsole(!showConsole)}
          showConsole={showConsole}
          onToggleLayout={() => setVertical(!vertical)}
          vertical={vertical}
        />

        <div className={`flex ${vertical ? 'flex-col' : 'flex-row'}`}>
          <Resizable
            className="min-h-[200px]"
            defaultSize={{
              width: vertical ? '100%' : '50%',
              height: vertical ? 300 : '100%',
            }}
            enable={{
              bottom: vertical,
              right: !vertical,
            }}
          >
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              wrapContent
              closableTabs
              onChange={(v) => setCode(v)}
            />
          </Resizable>

          <div className="flex-1 min-h-[200px]">
            <SandpackPreview showNavigator />
            {showConsole && <SandpackConsole />}
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}
