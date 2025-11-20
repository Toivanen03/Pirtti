const MapsPlugin = ({ mobile }) => {
    return (
        <div>
            <iframe
                className="maps mt-5"
                width={mobile ? "320" : "576"}
                height={mobile ? "320" : "576"}
                id="gmap_canvas"
                src="https://maps.google.com/maps?hl=fi&amp;q=Telk%C3%A4nkatu%202%20Mikkeli+(P%C3%A4iv%C3%A4koti%20Pirtti)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">    
            </iframe>
        </div>
    )
}

export default MapsPlugin