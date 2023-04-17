import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Style from '@/styles/index.module.css'

export default class Home extends React.Component {
  render() {
    return (
      <div className={Style.container}>
        <Image src="/logo.png" width={783} height={319} alt='logo' />
        <div className={Style.divbutton}>
          <Link className={Style.button} href="/login"><button className="btn btn-primary">Login</button></Link>
          <Link className={Style.button} href="/register"><button className="btn btn-secondary">Registrar</button></Link>
        </div>
        <Link className={Style.button} href="/produtos"><button className="btn btn-accent">Produtos</button></Link>
      </div>
    )
  }
}