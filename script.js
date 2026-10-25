const testCases = [
  {
    caseId: "TC-001",
    title: "ログイン画面を表示する",
    module: "ログイン",
    steps: "1. ログイン画面を開く",
    expectedResult: "ログインフォームが表示される",
    actualResult: "ログインフォームが表示された",
    status: "passed"
  },
  {
    caseId: "TC-002",
    title: "必須項目を未入力で送信する",
    module: "入力チェック",
    steps: "1. 入力欄を空のまま送信する",
    expectedResult: "必須項目のエラーが表示される",
    actualResult: "",
    status: "not-run"
  },
  {
    caseId: "TC-003",
    title: "誤ったパスワードでログインする",
    module: "ログイン",
    steps: "1. 正しくないパスワードを入力する\n2. ログインを実行する",
    expectedResult: "エラーメッセージが表示される",
    actualResult: "エラーが表示されなかった",
    status: "failed"
  },
  {
    caseId: "TC-004",
    title: "正しい認証情報でログインする",
    module: "ログイン",
    steps: "1. 登録済みのメールアドレスとパスワードを入力する\n2. ログインを実行する",
    expectedResult: "ログイン後にホーム画面が表示される",
    actualResult: "ホーム画面が表示された",
    status: "passed"
  },
  {
    caseId: "TC-005",
    title: "検索キーワードに一致する項目を表示する",
    module: "検索",
    steps: "1. 検索欄に「商品A」と入力する\n2. 検索を実行する",
    expectedResult: "商品Aに一致する検索結果が表示される",
    actualResult: "",
    status: "not-run"
  },
  {
    caseId: "TC-006",
    title: "検索結果がない場合に案内を表示する",
    module: "検索",
    steps: "1. 該当データがないキーワードを入力する\n2. 検索を実行する",
    expectedResult: "検索結果がないことを示す案内が表示される",
    actualResult: "検索結果が空のまま案内が表示されなかった",
    status: "failed"
  },
  {
    caseId: "TC-007",
    title: "必須項目を入力して会員登録する",
    module: "会員登録",
    steps: "1. 氏名、メールアドレス、パスワードを入力する\n2. 登録を実行する",
    expectedResult: "会員登録が完了し、完了メッセージが表示される",
    actualResult: "",
    status: "not-run"
  },
  {
    caseId: "TC-008",
    title: "プロフィール情報を更新する",
    module: "プロフィール",
    steps: "1. プロフィール編集画面を開く\n2. 表示名を変更して保存する",
    expectedResult: "変更した表示名がプロフィールに反映される",
    actualResult: "変更した表示名が反映された",
    status: "passed"
  },
  {
    caseId: "TC-009",
    title: "パスワード再設定メールを送信する",
    module: "パスワード再設定",
    steps: "1. 登録済みのメールアドレスを入力する\n2. 再設定メールを送信する",
    expectedResult: "再設定メールを送信したことが案内される",
    actualResult: "",
    status: "not-run"
  },
  {
    caseId: "TC-010",
    title: "ログアウト後にログイン画面へ戻る",
    module: "ログアウト",
    steps: "1. ログイン済みの状態でログアウトを実行する",
    expectedResult: "セッションが終了し、ログイン画面が表示される",
    actualResult: "ログイン画面が表示された",
    status: "passed"
  }
];

const statusLabels = {
  "not-run": "未実施",
  passed: "合格",
  failed: "不合格"
};

const testCaseList = document.querySelector("#test-case-list");
const totalCount = document.querySelector("#total-count");
const passedCount = document.querySelector("#passed-count");
const failedCount = document.querySelector("#failed-count");
const testCaseForm = document.querySelector("#test-case-form");
const addTestCaseButton = document.querySelector("#add-test-case-button");
const statusFilter = document.querySelector("#status-filter");
const formHeading = document.querySelector("#form-heading");
const submitButton = testCaseForm.querySelector("button[type='submit']");
const cancelEditButton = document.querySelector("#cancel-edit-button");
let editingIndex = null;

function renderTestCases() {
  testCaseList.replaceChildren();
  const selectedStatus = statusFilter.value;
  const visibleTestCases = testCases
    .map((testCase, index) => ({ testCase, index }))
    .filter(({ testCase }) => selectedStatus === "all" || testCase.status === selectedStatus);

  visibleTestCases.forEach(({ testCase, index }) => {
    const row = document.createElement("tr");
    const values = [
      testCase.caseId,
      testCase.title,
      testCase.module,
      testCase.steps,
      testCase.expectedResult,
      testCase.actualResult || "—",
      statusLabels[testCase.status]
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    const actionCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.dataset.action = "edit";
    editButton.dataset.caseIndex = index;
    editButton.textContent = "編集";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.caseIndex = index;
    deleteButton.textContent = "削除";

    actionCell.append(editButton, deleteButton);
    row.append(actionCell);
    testCaseList.append(row);
  });

  totalCount.textContent = testCases.length;
  passedCount.textContent = testCases.filter((testCase) => testCase.status === "passed").length;
  failedCount.textContent = testCases.filter((testCase) => testCase.status === "failed").length;
}

function resetForm() {
  editingIndex = null;
  testCaseForm.reset();
  formHeading.textContent = "テストケースを追加";
  submitButton.textContent = "保存";
}

testCaseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(testCaseForm);
  const testCase = {
    caseId: formData.get("case-id").trim(),
    title: formData.get("title").trim(),
    module: formData.get("module").trim(),
    steps: formData.get("steps").trim(),
    expectedResult: formData.get("expected-result").trim(),
    actualResult: formData.get("actual-result").trim(),
    status: formData.get("test-status")
  };

  if (editingIndex === null) {
    testCases.push(testCase);
  } else {
    testCases[editingIndex] = testCase;
  }

  renderTestCases();
  resetForm();
});

testCaseList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) {
    return;
  }

  const caseIndex = Number(actionButton.dataset.caseIndex);
  if (!Number.isInteger(caseIndex) || !testCases[caseIndex]) {
    return;
  }

  if (actionButton.dataset.action === "edit") {
    const testCase = testCases[caseIndex];
    editingIndex = caseIndex;
    testCaseForm.elements["case-id"].value = testCase.caseId;
    testCaseForm.elements.title.value = testCase.title;
    testCaseForm.elements.module.value = testCase.module;
    testCaseForm.elements.steps.value = testCase.steps;
    testCaseForm.elements["expected-result"].value = testCase.expectedResult;
    testCaseForm.elements["actual-result"].value = testCase.actualResult;
    testCaseForm.elements["test-status"].value = testCase.status;
    formHeading.textContent = "テストケースを編集";
    submitButton.textContent = "更新";
    testCaseForm.scrollIntoView({ behavior: "smooth", block: "start" });
    testCaseForm.elements.title.focus({ preventScroll: true });
    return;
  }

  if (actionButton.dataset.action === "delete" && window.confirm("このテストケースを削除しますか？")) {
    testCases.splice(caseIndex, 1);
    if (editingIndex === caseIndex) {
      resetForm();
    } else if (editingIndex !== null && editingIndex > caseIndex) {
      editingIndex -= 1;
    }
    renderTestCases();
  }
});

cancelEditButton.addEventListener("click", resetForm);

addTestCaseButton.addEventListener("click", () => {
  testCaseForm.scrollIntoView({ behavior: "smooth", block: "start" });
  testCaseForm.querySelector("input").focus({ preventScroll: true });
});

statusFilter.addEventListener("change", renderTestCases);

renderTestCases();
