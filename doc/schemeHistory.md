# first attempt

/system_status
    /status: [online, updating]
    /details: "string"
/stores
    /asia
        /[Abreviatura país]
            /added_at
            /last_check_at
            /status: [open, close]
        [...]
    /europa
        /[Abreviatura país]
            /added_at
            /last_check_at
            /status: [open, close]
        [...]
    /america
        /[Abreviatura país]
            /added_at
            /last_check_at
            /status: [open, close]
        [...]
/currency_vals
    [moneda]: [multiplicador]
    [...]
/games
    /coming_soon
        /HACXXX
            /spicy_uid: id
            /nsuid europa: id
            /nsuid america: id
            /nsuid asia: id
            /last_modification: date(dd/mm/yyyy)
            /added_at: date(dd/mm/yyyy)
            /last_verification: date(dd/mm/yyyy)
            /game_status [ historical, pending, active ]
            /system_status [ updating, errors, ready ]
            /vandal 
                /spanish_title: string
                /spanish_description: string
                /rating: rate
                /review_url: url
            /media
                photos: {
                    url1: url
                    url_vandal: url 
                    url_vandal2: url
                }
                /videos: {
                    video: url
                }
            /prices
                country: {
                    /base:
                    /discount: [false,
                        price:
                        started_at:
                        ends_at: date(dd/mm/yyyy)
                        percentage:
                    ]
                    /history:
                        date: price
                        [...]
                }
                [...]
            /america_raw
            /europe_raw
            /asia_raw
    /available_now
        /HACXXX
            /spicy_uid: id
            /nsuid europa: id
            /nsuid america: id
            /nsuid asia: id
            /last_modification: date(dd/mm/yyyy)
            /added_at: date(dd/mm/yyyy)
            /last_verification: date(dd/mm/yyyy)
            /game_status [ historical, pending, active ]
            /system_status [ updating, errors, ready ]
            /vandal 
                /spanish_title: string
                /spanish_description: string
                /rating: rate
                /review_url: url
            /media
                photos: {
                    url1: url
                    url_vandal: url 
                    url_vandal2: url
                }
                /videos: {
                    video: url
                }
            /prices
                country: {
                    /base:
                    /discount: [false,
                        price:
                        started_at:
                        ends_at: date(dd/mm/yyyy)
                        percentage:
                    ]
                    /history:
                        date: price
                        [...]
                }
                [...]
            /america_raw
            /europe_raw
            /asia_raw



# Second attempt

/system_status
    /status: [online, updating]
    /details: "string"
/stores
    /asia
        /[Abreviatura país]
            /added_at
            /last_check_at
            /status: [open, close]
        [...]
    /europa
        /[Abreviatura país]
            /added_at
            /last_check_at
            /status: [open, close]
        [...]
    /america
        /[Abreviatura país]
            /added_at
            /last_check_at
            /status: [open, close]
        [...]
/currency_vals
    [moneda]: [multiplicador]
    [...]
/games
    /hashtitle
        /spicy_uid: id ????
        /nsuid europa: id
        /nsuid america: id
        /nsuid asia: id
        /HAC: HACXXXX
        /last_modification: date(dd/mm/yyyy)
        /added_at: date(dd/mm/yyyy)
        /last_verification: date(dd/mm/yyyy)
        /game_status [ historical, pending, active ]
        /system_status [ updating, errors, ready ]
        /title: string
        /categories: []
        /vandal 
            /spanish_title: string
            /spanish_description: string
            /rating: rate
            /review_url: url
        /media
            photos: {
                url1: url
                url_vandal: url 
                url_vandal2: url
            }
            /videos: {
                video: url
            }
        /prices
            country: {
                /base:
                /discount: [false,
                    price:
                    started_at:
                    ends_at: date(dd/mm/yyyy)
                    percentage:
                ]
                /history:
                    date: price
                    [...]
            }
            [...]
        /america_raw
        /europe_raw
        /asia_raw



