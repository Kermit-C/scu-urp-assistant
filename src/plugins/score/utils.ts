import { CourseScoreRecord } from './types'

/**
 * 将数值保留3位小数，再作为number返回
 *
 * @param {number} num 待处理的数字
 * @param {number} [fractionDigits=3] 保留小数位数
 * @returns 保留对应位数后的小数
 */
function reserveDigits(num: number, fractionDigits = 3): number {
  return Number(num.toFixed(fractionDigits))
}

/**
 * 计算加权平均数
 *
 * @param {Array<{ value: number; weight: number }>} arr 一个数组，每个对象包括数值(value)和权值(weight)
 * @returns 计算好的加权平均数
 */
function getWeightedAverage(
  arr: Array<{ value: number; weight: number }>
): number {
  return arr
    .reduce(
      (acc, cur) => [acc[0] + cur.value * cur.weight, acc[1] + cur.weight],
      [0, 0]
    )
    .reduce((valueSum, weightSum) => (weightSum ? valueSum / weightSum : 0))
}

/**
 * 将课程数组映射为只包含gpa作为数值，学分作为权值的对象数组，用于加权平均数计算
 *
 * @param {CourseScoreRecord[]} arr 一个课程数组
 * @returns 一个只包含gpa作为数值，学分作为权值的对象数组
 */
function mapGPA(
  arr: CourseScoreRecord[]
): {
  value: number
  weight: number
}[] {
  return arr.map(v => ({ value: v.gradePoint || 0, weight: v.credit }))
}

/**
 * 将课程数组映射为只包含分数作为数值，学分作为权值的对象数组，用于加权平均数计算
 *
 * @param {CourseScoreRecord[]} arr 一个课程数组
 * @returns 一个只包含分数作为数值，学分作为权值的对象数组
 */
function mapScore(
  arr: CourseScoreRecord[]
): {
  value: number
  weight: number
}[] {
  return arr.map(v => ({ value: v.courseScore || 0, weight: v.credit }))
}

/**
 * 从一个课程数组里筛选出所有的必修课程
 *
 * @param {CourseScoreRecord[]} arr 一个课程数组
 * @returns 筛选出的只包括必修课程的数组
 */
function getCompulsoryCourses(arr: CourseScoreRecord[]): CourseScoreRecord[] {
  return arr.filter(v => v.coursePropertyName === '必修')
}

/**
 * 从一个课程数组里筛选出所有的被选中的课程
 *
 * @param {CourseScoreRecord[]} arr 一个课程数组
 * @returns 筛选出的被选中的课程的数组
 */
function getSelectedCourses(arr: CourseScoreRecord[]): CourseScoreRecord[] {
  return arr.filter(v => v.selected)
}

/**
 * 输入课程数组，得到必修加权平均绩点
 *
 * @param {CourseScoreRecord[]} 课程数组
 * @returns 必修加权平均绩点
 */
function getCompulsoryCoursesGPA(arr: CourseScoreRecord[]): number {
  return reserveDigits(getWeightedAverage(mapGPA(getCompulsoryCourses(arr))))
}

/**
 * 输入课程数组，得到必修加权平均分
 *
 * @param {CourseScoreRecord[]} arr 课程数组
 * @returns 必修加权平均分
 */
function getSelectedCoursesScore(arr: CourseScoreRecord[]): number {
  return reserveDigits(getWeightedAverage(mapScore(getSelectedCourses(arr))))
}

/**
 * 输入课程数组，得到选中课程加权平均绩点
 *
 * @param {CourseScoreRecord[]} 课程数组
 * @returns 选中课程加权平均绩点
 */
function getSelectedCoursesGPA(arr: CourseScoreRecord[]): number {
  return reserveDigits(getWeightedAverage(mapGPA(getSelectedCourses(arr))))
}

/**
 * 输入课程数组，得到必修加权平均分
 *
 * @param {CourseScoreRecord[]} arr 课程数组
 * @returns 必修加权平均分
 */
function getCompulsoryCoursesScore(arr: CourseScoreRecord[]): number {
  return reserveDigits(getWeightedAverage(mapScore(getCompulsoryCourses(arr))))
}

/**
 * 输入课程数组，得到全部课程加权平均绩点
 *
 * @param {CourseScoreRecord[]} arr 课程数组
 * @returns 全部课程加权平均绩点
 */
function getAllCoursesGPA(arr: CourseScoreRecord[]): number {
  return reserveDigits(getWeightedAverage(mapGPA(arr)))
}

/**
 * 输入课程数组，得到全部课程加权平均分
 *
 * @param {CourseScoreRecord[]} arr 课程数组
 * @returns 全部课程加权平均分
 */
function getAllCoursesScore(arr: CourseScoreRecord[]): number {
  return reserveDigits(getWeightedAverage(mapScore(arr)))
}

/**
 * 当课程数组存在重修课程时，仅保留该课程的最新成绩
 *
 * @param {CourseScoreRecord[]} arr 课程数组
 * @returns {CourseScoreRecord[]} 去除重复课程后的课程数组
 */
function reserveNewerCoursesForRetakenCourses(
  arr: CourseScoreRecord[]
): CourseScoreRecord[] {
  return Object.values(
    arr
      .sort((a, b) => Number(a.examTime) - Number(b.examTime))
      .reduceRight(
        (acc, cur) =>
          acc[cur.courseNumber] ? acc : { ...acc, [cur.courseNumber]: cur },
        {} as Record<string, CourseScoreRecord>
      )
  )
}

/**
 * 当课程数组存在重修课程时，仅保留该课程的第一次成绩
 *
 * @param {CourseScoreRecord[]} arr 课程数组
 * @returns {CourseScoreRecord[]} 去除重复课程后的课程数组
 */
function reserveOlderCoursesForRetakenCourses(
  arr: CourseScoreRecord[]
): CourseScoreRecord[] {
  return Object.values(
    arr
      .sort((a, b) => Number(a.examTime) - Number(b.examTime))
      .reduce(
        (acc, cur) =>
          acc[cur.courseNumber] ? acc : { ...acc, [cur.courseNumber]: cur },
        {} as Record<string, CourseScoreRecord>
      )
  )
}

export {
  getCompulsoryCoursesGPA,
  getCompulsoryCoursesScore,
  getAllCoursesGPA,
  getAllCoursesScore,
  getCompulsoryCourses,
  getSelectedCourses,
  getSelectedCoursesScore,
  getSelectedCoursesGPA,
  reserveNewerCoursesForRetakenCourses,
  reserveOlderCoursesForRetakenCourses
}
