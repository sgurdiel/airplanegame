import { createDefaultPreset, type JestConfigWithTsJest } from 'ts-jest';



const presetConfig = createDefaultPreset({
});

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**'
  ],
  coverageDirectory: "../dev-reports/devbox.d/web/coverage/airplanegame",
  coveragePathIgnorePatterns: [
    "/src/App\.ts",
  ],
  coverageProvider: "v8",
  testMatch: [
    "**/test/**/?(*.)+(spec|test).[tj]s?(x)"
  ],
};

export default jestConfig;
