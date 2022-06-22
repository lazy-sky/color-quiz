import styles from './pageHeader.module.scss'

const PageHeader = ({ title }: { title: string }) => {
  return <h1 className={styles.pageHeader}>{title}</h1>
}

export default PageHeader
