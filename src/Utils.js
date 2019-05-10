export function getResultPic(result)
{
    switch (result)
    {
        case 0: return "result-fail.png";
        case 1: return "result-faults.png";
        case 2: return "result-success.png";
        default: return null;
    }
}

export function getApiUrl(apiName: string, kind: string ): string
{
    return `https://www.remranger.com/escalada-api/${apiName}-${kind}.php`;
}

export function formatDate(date)
{
    let d = new Date(date);
    return `${d.toDateString().substring(0, 3)} ${d.getDate()}-${d.toDateString().substring(4, 7)}-${d.getFullYear()}`;
}

