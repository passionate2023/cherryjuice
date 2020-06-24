import { aHtmlToHtml } from '../index';
import { ctbToAHtml } from '../../ctb-to-ahtml';
import { renderingIssues } from '../../ctb-to-ahtml/__tests__/__data__';

const renderingTestTemplate = async ({ txt, otherTables }) => {
  const res = aHtmlToHtml(
    await ctbToAHtml({
      nodeTableXml: txt,
      otherTables,
    }),
  );
  expect(res).toMatchSnapshot();
};

describe('rich-text snapshot tests', () => {
  test(renderingIssues.issue_01.name, () => {
    renderingTestTemplate(renderingIssues.issue_01);
  });
  test(renderingIssues.issue_02.name, () => {
    renderingTestTemplate(renderingIssues.issue_02);
  });
  test(renderingIssues.issue_03.name, () => {
    renderingTestTemplate(renderingIssues.issue_03);
  });
  test(renderingIssues.issue_04.name, () => {
    renderingTestTemplate(renderingIssues.issue_04);
  });
  test(renderingIssues.issue_05.name, () => {
    renderingTestTemplate(renderingIssues.issue_05);
  });
  test(renderingIssues.issue_06.name, () => {
    renderingTestTemplate(renderingIssues.issue_06);
  });
  test(renderingIssues.issue_07.name, () => {
    renderingTestTemplate(renderingIssues.issue_07);
  });
  test(renderingIssues.issue_08.name, () => {
    renderingTestTemplate(renderingIssues.issue_08);
  });
});
