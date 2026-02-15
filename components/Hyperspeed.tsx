'use client'

import { useEffect, useRef } from 'react'
import './Hyperspeed.css'

const Hyperspeed = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return

        let isActive = true
        let animationId: number

        const loadHyperspeed = async () => {
            try {
                const THREE = await import('three')
                const { EffectComposer, RenderPass, EffectPass, BloomEffect } = await import('postprocessing')

                if (!containerRef.current || !isActive) return

                const container = containerRef.current
                const scene = new THREE.Scene()
                const camera = new THREE.PerspectiveCamera(
                    90,
                    container.offsetWidth / container.offsetHeight,
                    0.1,
                    10000
                )

                camera.position.set(0, 8, -5)

                const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
                renderer.setSize(container.offsetWidth, container.offsetHeight)
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
                container.appendChild(renderer.domElement)

                // Pink/Magenta colors matching Game Plug theme
                const colors = {
                    leftCars: [0xec4899, 0xf43f5e, 0xff006e],
                    rightCars: [0x8b5cf6, 0x6366f1, 0x3b82f6],
                    sticks: 0xec4899
                }

                // Create road
                const roadGeometry = new THREE.PlaneGeometry(20, 400, 20, 100)
                const roadMaterial = new THREE.MeshBasicMaterial({
                    color: 0x0a0a0a,
                    side: THREE.DoubleSide
                })
                const road = new THREE.Mesh(roadGeometry, roadMaterial)
                road.rotation.x = -Math.PI / 2
                road.position.z = -200
                scene.add(road)

                // Create car lights
                const carLights: any[] = []
                const createCarLight = (color: number, x: number, speed: number) => {
                    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 8)
                    const material = new THREE.MeshBasicMaterial({ color })
                    const light = new THREE.Mesh(geometry, material)
                    light.position.set(x, 1, -Math.random() * 400)
                    light.userData = { speed, initialZ: light.position.z }
                    scene.add(light)
                    carLights.push(light)
                }

                // Add car lights
                for (let i = 0; i < 30; i++) {
                    const color = colors.leftCars[Math.floor(Math.random() * colors.leftCars.length)]
                    createCarLight(color, -5 + Math.random() * 2, 60 + Math.random() * 20)
                }

                for (let i = 0; i < 30; i++) {
                    const color = colors.rightCars[Math.floor(Math.random() * colors.rightCars.length)]
                    createCarLight(color, 5 - Math.random() * 2, -120 - Math.random() * 40)
                }

                // Create light sticks
                const sticks: any[] = []
                for (let i = 0; i < 40; i++) {
                    const geometry = new THREE.PlaneGeometry(0.2, 1.5)
                    const material = new THREE.MeshBasicMaterial({
                        color: colors.sticks,
                        side: THREE.DoubleSide
                    })
                    const stick = new THREE.Mesh(geometry, material)
                    stick.position.set(-10, 0.75, -i * 10)
                    stick.rotation.y = Math.PI / 2
                    scene.add(stick)
                    sticks.push(stick)
                }

                // Post-processing
                const composer = new EffectComposer(renderer)
                const renderPass = new RenderPass(scene, camera)
                const bloomEffect = new BloomEffect({
                    luminanceThreshold: 0.2,
                    luminanceSmoothing: 0.5,
                    intensity: 1.5
                })
                const bloomPass = new EffectPass(camera, bloomEffect)

                composer.addPass(renderPass)
                composer.addPass(bloomPass)

                // Animation
                let time = 0
                const animate = () => {
                    if (!isActive) return

                    time += 0.016

                    // Animate car lights
                    carLights.forEach(light => {
                        light.position.z += light.userData.speed * 0.016 * 2
                        if (light.position.z > 50) light.position.z = -400
                        if (light.position.z < -450) light.position.z = 50
                    })

                    // Animate sticks
                    sticks.forEach((stick) => {
                        stick.position.z += 2
                        if (stick.position.z > 50) stick.position.z = -400
                    })

                    // Camera sway
                    camera.position.x = Math.sin(time * 0.3) * 1
                    camera.rotation.z = Math.sin(time * 0.3) * 0.02

                    composer.render(0.016)
                    animationId = requestAnimationFrame(animate)
                }

                animate()

                // Handle resize
                const handleResize = () => {
                    if (!container || !isActive) return
                    camera.aspect = container.offsetWidth / container.offsetHeight
                    camera.updateProjectionMatrix()
                    renderer.setSize(container.offsetWidth, container.offsetHeight)
                    composer.setSize(container.offsetWidth, container.offsetHeight)
                }

                window.addEventListener('resize', handleResize)

                return () => {
                    isActive = false
                    window.removeEventListener('resize', handleResize)
                    if (animationId) cancelAnimationFrame(animationId)
                    renderer.dispose()
                    composer.dispose()
                    if (container && renderer.domElement.parentNode === container) {
                        container.removeChild(renderer.domElement)
                    }
                }
            } catch (error) {
                console.error('Hyperspeed initialization error:', error)
            }
        }

        const cleanup = loadHyperspeed()

        return () => {
            isActive = false
            cleanup.then(cleanupFn => cleanupFn && cleanupFn())
        }
    }, [])

    return <div id="lights" ref={containerRef} />
}

export default Hyperspeed
