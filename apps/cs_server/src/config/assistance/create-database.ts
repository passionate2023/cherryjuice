/* eslint-disable no-console */
import child_process from 'child_process';
import util from 'util';
import readline from 'readline';
import fs from 'fs';
import { pkgEnvFilePath } from '../env/load-env-variables';

const updateEnvFile = ({ password, databaseName }) => {
  const databaseUrl = `postgres://postgres:${password}@localhost:5432/${databaseName}`;
  console.log(' - database url is [' + databaseUrl + ']');
  try {
    const originalFile = fs.readFileSync(pkgEnvFilePath, 'utf8');
    const newFile =
      originalFile.replace(/DATABASE_URL.*[\r\n]+/, '') +
      `${
        originalFile.includes('\r\n') ? '\r\n' : '\n'
      }DATABASE_URL=${databaseUrl}`;
    fs.writeFileSync(pkgEnvFilePath, newFile);
    console.log(' - saved url in [' + pkgEnvFilePath + ']');
  } catch (e) {
    console.error(' - could not update .env file');
    throw new Error(e);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const exec = util.promisify(child_process.exec);

type Command = {
  test: (stdout: string) => boolean;
  successMessage: string;
  errorMessage: string;
  command: string;
};

const execute = async (
  { command, test, successMessage, errorMessage }: Command,
  env?: Record<string, string>,
) => {
  const { stdout, stderr } = await exec(command, { env });
  if (!test(stdout)) {
    console.log(' - ' + errorMessage);
    throw new Error(stdout + '\n' + stderr);
  } else console.log(' - ' + successMessage);
};

const pgCommands: Record<string, (params?: any) => Command> = {
  acceptingConnections: () => ({
    test: stdout => /localhost:5432 - accepting connections/.test(stdout),
    errorMessage: 'could not find postgres',
    successMessage: 'found postgres at localhost:5432',
    command: 'pg_isready --host=localhost --port=5432 --username=postgres',
  }),
  createdDatabase: name => ({
    test: stdout => /CREATE DATABASE/.test(stdout),
    errorMessage: 'could not create database',
    successMessage: 'database created',
    command: `psql -U postgres -c "create database ${name}"`,
  }),
};

type Question = {
  question: string;
  testAnswer: (answer: string) => boolean;
};
const ask = ({ question, testAnswer }: Question): Promise<string> => {
  return new Promise((res, rej) => {
    rl.question(' - ' + question + '  ', answer => {
      if (testAnswer(answer)) res(answer);
      else {
        console.log(` - user answer [${answer}] is negative`);
        rej();
      }
    });
  });
};

const userQuestions: { [k: string]: Question } = {
  createDatabase: {
    question: 'create a database? (y/n)',
    testAnswer: answer => /[y]/.test(answer),
  },
  postgresPassword: {
    question: `please enter the password for user [postgres]`,
    testAnswer: answer => /.+/.test(answer),
  },
};

export const createDatabase = async () => {
  try {
    console.log('\n');
    console.log(' - attempting to create a database');
    await execute(pgCommands.acceptingConnections());
    await ask(userQuestions.createDatabase);
    const password = await ask(userQuestions.postgresPassword);

    const databaseName = `cj_${Date.now()}`;
    await execute(pgCommands.createdDatabase(databaseName), {
      PGPASSWORD: password,
    });
    updateEnvFile({ password, databaseName });
    console.log(' - database created. please restart the app');
    process.exit(1);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
