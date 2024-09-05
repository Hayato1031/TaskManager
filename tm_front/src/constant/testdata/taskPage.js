const taskPageData = {
    task: {
        id: 1,
        title: "2024-秋学期",
        member: "Member1",
        taskStatus: true,
        approvalTask: 20,
        unapprovalTask: 2,
    },

    dailyTask: {
        id: 1,
        date: "2021-09-01",
        content: "今日はフロントエンドの実装を行った",
        img: "https://source.unsplash.com/random",
        nextAction: "明日はバックエンドの実装を行う",
        selfReview: 5,
    },

    comments: [
        {
            id: 2,
            taskId: 2,
            dailyTaskId: 2,
            comment: "もう少し改善できる点があります。",
        },
    ]
}

export default taskPageData;