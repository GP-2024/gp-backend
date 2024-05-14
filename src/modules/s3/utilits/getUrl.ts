export function getUrlFromBucket(bucket: string, key: string): string {
  return `https://${bucket}.s3.amazonaws.com/${key}`;
}
